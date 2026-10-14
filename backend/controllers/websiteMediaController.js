
import WebsiteMedia from '../models/WebsiteMedia.js';
import cloudinary from '../config/cloudinary.js';

// GET: Fetch active website media
// Example: /api/website-media?section=home
export const getWebsiteMedia = async (req, res) => {
  try {
    const { section, key } = req.query;
    const filter = { isActive: true };

    if (section) filter.section = section;
    if (key) filter.key = key;

    const media = await WebsiteMedia.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    console.error('Get website media error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch website media',
    });
  }
};

// GET: Fetch all media for the admin panel
export const getAllWebsiteMedia = async (req, res) => {
  try {
    const { section } = req.query;
    const filter = {};

    if (section) filter.section = section;

    const media = await WebsiteMedia.find(filter).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    console.error('Get all website media error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch website media',
    });
  }
};

// POST: Upload or replace a media placement
export const uploadWebsiteMedia = async (req, res) => {
  let uploadedPublicId;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image or video',
      });
    }

    uploadedPublicId = req.file.filename;

    const { name, key, section, altText = '' } = req.body;

    if (!name?.trim() || !key?.trim() || !section) {
      return res.status(400).json({
        success: false,
        message: 'Name, key, and section are required',
      });
    }

    const mediaType = req.file.mimetype?.startsWith('video/')
      ? 'video'
      : 'image';

    const normalizedKey = key.trim().toLowerCase();

    const existingMedia = await WebsiteMedia.findOne({
      key: normalizedKey,
    });

    const mediaData = {
      name: name.trim(),
      key: normalizedKey,
      section,
      mediaUrl: req.file.path,
      publicId: uploadedPublicId,
      mediaType,
      altText: altText.trim(),
      isActive: true,
    };

    let savedMedia;

    if (existingMedia) {
      const oldPublicId = existingMedia.publicId;
      const oldMediaType = existingMedia.mediaType;

      Object.assign(existingMedia, mediaData);
      savedMedia = await existingMedia.save();

      // Delete the old Cloudinary asset after the database update.
      if (oldPublicId && oldPublicId !== uploadedPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, {
            resource_type: oldMediaType === 'video' ? 'video' : 'image',
          });
        } catch (cleanupError) {
          console.error('Old Cloudinary asset cleanup failed:', cleanupError);
        }
      }
    } else {
      savedMedia = await WebsiteMedia.create(mediaData);
    }

    return res.status(201).json({
      success: true,
      message: existingMedia
        ? 'Website media replaced successfully'
        : 'Website media uploaded successfully',
      data: savedMedia,
    });
  } catch (error) {
    console.error('Upload website media error:', error);

    // Clean up the newly uploaded asset if saving failed.
    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId, {
          resource_type: req.file?.mimetype?.startsWith('video/')
            ? 'video'
            : 'image',
        });
      } catch (cleanupError) {
        console.error('Uploaded asset cleanup failed:', cleanupError);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This media placement already exists. Please try again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload website media',
    });
  }
};

// PATCH: Activate or deactivate media
export const updateWebsiteMediaStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be true or false',
      });
    }

    const media = await WebsiteMedia.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Website media not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Website media status updated',
      data: media,
    });
  } catch (error) {
    console.error('Update website media status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update website media status',
    });
  }
};

// DELETE: Delete media from MongoDB and Cloudinary
export const deleteWebsiteMedia = async (req, res) => {
  try {
    const media = await WebsiteMedia.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Website media not found',
      });
    }

    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.mediaType === 'video' ? 'video' : 'image',
    });

    await media.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Website media deleted successfully',
    });
  } catch (error) {
    console.error('Delete website media error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete website media',
    });
  }
};
