import GalleryItem from '../models/GalleryItem.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to backend/uploads/gallery
const uploadDir = path.resolve(__dirname, '../uploads/gallery');

// Safely remove files uploaded in a failed request
const cleanupLocalFiles = async (files = []) => {
  await Promise.allSettled(
    files.map(async (file) => {
      if (file.filename) {
        const filePath = path.resolve(uploadDir, file.filename);

        // Ensure the file is inside the gallery upload directory
        if (path.dirname(filePath) === uploadDir) {
          await fs.unlink(filePath);
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

    const documents = files.map((file) => {
      const isVideo = file.mimetype?.startsWith('video/');

      return {
        title: title.trim(),
        school,
        year: year.trim(),
        category: category.trim(),
        mediaUrl: `/uploads/gallery/${file.filename}`,
        filename: file.filename,
        mediaType: isVideo ? 'video' : 'image',
      };
    });

    const savedItems = await GalleryItem.insertMany(documents);

    return res.status(201).json({
      success: true,
      message: `${savedItems.length} media item(s) uploaded successfully.`,
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error('Gallery Upload Error:', error);

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
export const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
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

    // Use the stored filename rather than trusting a URL from MongoDB
    if (item.filename) {
      const filePath = path.resolve(uploadDir, item.filename);

      // Prevent paths outside uploads/gallery
      if (path.dirname(filePath) !== uploadDir) {
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