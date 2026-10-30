import GalleryItem from '../models/GalleryItem.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../uploads/gallery');

// Resolve and validate a file's actual location.
const getSafeFilePath = (file) => {
  if (!file?.filename) {
    throw new Error('Uploaded file has no filename.');
  }

  const filePath = path.resolve(file.path || path.join(uploadDir, file.filename));
  const relativePath = path.relative(uploadDir, filePath);

  // Reject paths outside uploads/gallery.
  if (
    !relativePath ||
    relativePath.startsWith(`..${path.sep}`) ||
    relativePath === '..' ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error('Uploaded file is outside the gallery directory.');
  }

  return filePath;
};

// Clean up files from a failed upload request.
const cleanupLocalFiles = async (files = []) => {
  await Promise.allSettled(
    files.map(async (file) => {
      try {
        const filePath = getSafeFilePath(file);
        await fs.unlink(filePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Gallery file cleanup error:', error.message);
        }
      }
    })
  );
};

/*
 * Upload multiple Gallery Items
 * POST /api/gallery/upload
 */
export const uploadGalleryItem = async (req, res) => {
  const files = req.files || [];
  let savedItems = [];

  try {
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one image or video.',
      });
    }

    if (files.length > 10) {
      await cleanupLocalFiles(files);

      return res.status(400).json({
        success: false,
        message: 'You can upload a maximum of 10 files at a time.',
      });
    }

    const { title, school, year, category } = req.body;

    if (
      !title?.trim() ||
      !school?.trim() ||
      !year?.trim() ||
      !category?.trim()
    ) {
      await cleanupLocalFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Title, school, year and category are required.',
      });
    }

    const allowedSchools = ['Sector 6', 'Sector 11'];

    if (!allowedSchools.includes(school)) {
      await cleanupLocalFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Invalid school selected.',
      });
    }

    if (!/^\d{4}$/.test(year.trim())) {
      await cleanupLocalFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Please enter a valid four-digit year.',
      });
    }

    // Verify every file exists before creating database records.
    const documents = await Promise.all(
      files.map(async (file) => {
        const filePath = getSafeFilePath(file);

        await fs.access(filePath);

        const actualFilename = path.basename(filePath);
        const isVideo = file.mimetype?.startsWith('video/');

        console.log('Gallery upload verification:', {
          originalFilename: file.originalname,
          actualFilename,
          filePath,
          fileExists: true,
          mediaUrl: `/uploads/gallery/${actualFilename}`,
        });

        return {
          title: title.trim(),
          school,
          year: year.trim(),
          category: category.trim(),
          mediaUrl: `/uploads/gallery/${actualFilename}`,
          filename: actualFilename,
          mediaType: isVideo ? 'video' : 'image',
        };
      })
    );

    // Save the records only after verifying the uploaded files.
    savedItems = await GalleryItem.insertMany(documents);

    return res.status(201).json({
      success: true,
      message: `${savedItems.length} media item(s) uploaded successfully.`,
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error('Gallery Upload Error:', error);

    /*
     * If a database insertion partially succeeded, remove those
     * records before cleaning up their corresponding uploaded files.
     */
    try {
      const filenames = files
        .filter((file) => file.filename)
        .map((file) => file.filename);

      if (filenames.length > 0) {
        await GalleryItem.deleteMany({ filename: { $in: filenames } });
      }
    } catch (rollbackError) {
      console.error('Gallery database rollback error:', rollbackError);
    }

    await cleanupLocalFiles(files);

    return res.status(500).json({
      success: false,
      message: 'Failed to upload gallery media.',
    });
  }
};

/*
 * Get Gallery Items
 * GET /api/gallery
 */
/*
 * Get Gallery Items with server-side pagination and filtering
 * GET /api/gallery?page=1&limit=12&school=Sector%206&mediaType=image
 */
export const getGalleryItems = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 12;

    // Prevent excessively large requests.
    const limit = Math.min(24, Math.max(1, requestedLimit));
    const skip = (page - 1) * limit;

    const { school, year, category, mediaType } = req.query;

    const filter = {};

    if (school) {
      if (!['Sector 6', 'Sector 11'].includes(school)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school selected.',
        });
      }

      filter.school = school;
    }

    if (year) {
      if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid year.',
        });
      }

      filter.year = year;
    }

    if (mediaType) {
      if (!['image', 'video'].includes(mediaType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid media type.',
        });
      }

      filter.mediaType = mediaType;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const [items, totalRecords, availableYears, availableCategories] =
      await Promise.all([
        GalleryItem.find(filter)
          .sort({ createdAt: -1, _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        GalleryItem.countDocuments(filter),

        // Load filter options independently of the current page.
        school
          ? GalleryItem.distinct('year', { school })
          : GalleryItem.distinct('year'),

        // Categories are photo filters for the selected school/year.
        GalleryItem.distinct('category', {
          ...(school ? { school } : {}),
          ...(year ? { year } : {}),
          mediaType: 'image',
        }),
      ]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.set('Cache-Control', 'no-store');

    return res.status(200).json({
      success: true,
      items,
      count: items.length,
      pagination: {
        currentPage: page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        years: availableYears.sort(
          (a, b) => Number(b) - Number(a)
        ),
        categories: availableCategories.sort(),
      },
    });
  } catch (error) {
    console.error('Gallery Fetch Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items.',
    });
  }
};

/*
 * Delete Gallery Item
 * DELETE /api/gallery/:id
 */
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
      });
    }

    if (item.filename) {
      const filePath = path.resolve(uploadDir, item.filename);
      const relativePath = path.relative(uploadDir, filePath);

      if (
        !relativePath ||
        relativePath.startsWith(`..${path.sep}`) ||
        relativePath === '..' ||
        path.isAbsolute(relativePath)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gallery filename.',
        });
      }

      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        if (fileError.code !== 'ENOENT') {
          console.error('Local File Delete Error:', fileError);

          return res.status(500).json({
            success: false,
            message: 'Could not delete the media file.',
          });
        }
      }
    }

    await GalleryItem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully.',
    });
  } catch (error) {
    console.error('Gallery Delete Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item.',
    });
  }
};