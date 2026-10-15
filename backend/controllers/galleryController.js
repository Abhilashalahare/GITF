
import GalleryItem from '../models/GalleryItem.js';
import cloudinary from '../config/cloudinary.js';

/*
 * Helper: delete uploaded files from Cloudinary.
 */
const cleanupCloudinaryFiles = async (files = []) => {
  await Promise.allSettled(
    files
      .filter((file) => file.public_id)
      .map((file) =>
        cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type || 'image',
        })
      )
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
      await cleanupCloudinaryFiles(files);

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
      await cleanupCloudinaryFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Title, school, year and category are required.',
      });
    }

    const allowedSchools = ['Sector 6', 'Sector 11'];

    if (!allowedSchools.includes(school)) {
      await cleanupCloudinaryFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Invalid school selected.',
      });
    }

    if (!/^\d{4}$/.test(year.trim())) {
      await cleanupCloudinaryFiles(files);

      return res.status(400).json({
        success: false,
        message: 'Please enter a valid four-digit year.',
      });
    }

    // Prepare one MongoDB document for each uploaded file.
    const documents = files.map((file) => ({
      title: title.trim(),
      school,
      year: year.trim(),
      category: category.trim(),
      mediaUrl: file.path,
      publicId: file.public_id || file.filename,
      mediaType:
        file.resource_type === 'video' ? 'video' : 'image',
    }));

    // Save all records.
    const savedItems = await GalleryItem.insertMany(documents);

    return res.status(201).json({
      success: true,
      message: `${savedItems.length} media item(s) uploaded successfully.`,
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error('Gallery Upload Error:', error);

    // Remove uploaded Cloudinary files if saving failed.
    await cleanupCloudinaryFiles(files);

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

    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type:
            item.mediaType === 'video' ? 'video' : 'image',
        });
      } catch (cloudinaryError) {
        console.error(
          'Cloudinary Delete Error:',
          cloudinaryError
        );

        return res.status(500).json({
          success: false,
          message:
            'Could not delete media from Cloudinary. Gallery item was not removed.',
        });
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
