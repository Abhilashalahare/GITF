
import WebsiteMedia from '../models/WebsiteMedia.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot = path.resolve(
  __dirname,
  '../uploads/website-media'
);

/**
 * Safely delete a locally stored website-media file.
 *
 * Supports:
 * /uploads/website-media/about/intro-2/example.jpeg
 *
 * Cloudinary URLs and other external URLs are ignored.
 */
const deleteLocalMediaFile = async (media) => {
  if (!media?.filename || !media?.mediaUrl) {
    return;
  }

  const urlPrefix = '/uploads/website-media/';

  // Only delete files managed by our local upload system.
  if (!media.mediaUrl.startsWith(urlPrefix)) {
    return;
  }

  const relativePath = decodeURIComponent(
    media.mediaUrl.slice(urlPrefix.length)
  );

  const filePath = path.resolve(uploadRoot, relativePath);

  // Prevent directory traversal outside the upload directory.
  if (
    !filePath.startsWith(uploadRoot + path.sep) ||
    path.basename(filePath) !== media.filename
  ) {
    throw new Error(
      'Invalid local media file path or filename mismatch'
    );
  }

  try {
    await fs.unlink(filePath);

    console.log('Deleted website media file:', filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    console.warn(
      'Website media file does not exist:',
      filePath
    );
  }
};

/**
 * Validate a placement key.
 *
 * Examples:
 * home/hero
 * about/intro-1
 * about/intro-2
 */
const validatePlacementKey = (key) => {
  if (typeof key !== 'string') {
    return false;
  }

  const parts = key.split('/');

  return (
    parts.length === 2 &&
    parts.every((part) =>
      /^[a-zA-Z0-9_-]+$/.test(part)
    )
  );
};

/**
 * Convert an absolute file path into a URL-safe relative path.
 *
 * Example:
 * D:\project\backend\uploads\website-media\about\intro-2\image.jpeg
 *
 * Becomes:
 * about/intro-2/image.jpeg
 */
const getRelativeMediaPath = (filePath) => {
  const absolutePath = path.resolve(filePath);

  const relativePath = path.relative(
    uploadRoot,
    absolutePath
  );

  // Reject paths outside the website-media directory.
  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(
      'Uploaded file is outside the website-media directory'
    );
  }

  return relativePath.split(path.sep).join('/');
};

/**
 * GET: Fetch active website media.
 */
export const getWebsiteMedia = async (req, res) => {
  try {
    const { section, key } = req.query;

    const filter = {
      isActive: true,
    };

    if (section) {
      filter.section = section;
    }

    if (key) {
      filter.key = key.trim().toLowerCase();
    }

    const media = await WebsiteMedia.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    console.error(
      'Get website media error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch website media',
    });
  }
};

/**
 * GET: Fetch all website media for the admin panel.
 */
export const getAllWebsiteMedia = async (req, res) => {
  try {
    const { section } = req.query;

    const filter = {};

    if (section) {
      filter.section = section;
    }

    const media = await WebsiteMedia.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error) {
    console.error(
      'Get all website media error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch website media',
    });
  }
};

/**
 * POST: Upload or replace a website media placement.
 */
export const uploadWebsiteMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image or video',
      });
    }

    const {
      name,
      key,
      section,
      altText = '',
    } = req.body;

    // Validate the form fields.
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof key !== 'string' ||
      !key.trim() ||
      !section
    ) {
      await fs.unlink(req.file.path).catch(() => {});

      return res.status(400).json({
        success: false,
        message: 'Name, key, and section are required',
      });
    }

    const normalizedKey = key.trim().toLowerCase();

    if (!validatePlacementKey(normalizedKey)) {
      await fs.unlink(req.file.path).catch(() => {});

      return res.status(400).json({
        success: false,
        message:
          'Invalid placement key. Use format section/placement-name.',
      });
    }

    // Confirm the middleware actually moved the file to its
    // expected final location before creating a database record.
    const relativePath = getRelativeMediaPath(
      req.file.path
    );

    const actualFilename = path.basename(
      req.file.path
    );

    // Check that the file really exists.
    await fs.access(req.file.path);

    // Build the public URL from the actual relative file path.
    const mediaUrl =
      `/uploads/website-media/${relativePath}`;

    const mediaType = req.file.mimetype?.startsWith(
      'video/'
    )
      ? 'video'
      : 'image';

    // These values must match the file on disk.
    const mediaData = {
      name: name.trim(),
      key: normalizedKey,
      section,
      mediaUrl,
      filename: actualFilename,
      mediaType,
      altText:
        typeof altText === 'string'
          ? altText.trim()
          : '',
      isActive: true,
    };

    console.log('Website media upload verification:', {
      key: normalizedKey,
      filePath: req.file.path,
      filename: actualFilename,
      relativePath,
      mediaUrl,
    });

    // Find an existing record for this placement.
    const existingMedia = await WebsiteMedia.findOne({
      key: normalizedKey,
    });

    let savedMedia;

    if (existingMedia) {
      const oldMedia = {
        filename: existingMedia.filename,
        mediaUrl: existingMedia.mediaUrl,
      };

      // Update the existing record first.
      Object.assign(existingMedia, mediaData);

      savedMedia = await existingMedia.save();

      // Only delete the previous file after the database
      // update has succeeded.
      if (
        oldMedia.mediaUrl !== mediaUrl ||
        oldMedia.filename !== actualFilename
      ) {
        try {
          await deleteLocalMediaFile(oldMedia);
        } catch (cleanupError) {
          console.error(
            'Old website media cleanup failed:',
            cleanupError
          );
        }
      }
    } else {
      savedMedia = await WebsiteMedia.create(
        mediaData
      );
    }

    return res.status(201).json({
      success: true,
      message: existingMedia
        ? 'Website media replaced successfully'
        : 'Website media uploaded successfully',
      data: savedMedia,
    });
  } catch (error) {
    console.error(
      'Upload website media error:',
      error
    );

    // If processing or saving fails, remove the newly
    // uploaded file without touching an existing file.
    if (req.file?.path) {
      try {
        const filePath = path.resolve(
          req.file.path
        );

        if (
          filePath.startsWith(
            uploadRoot + path.sep
          )
        ) {
          await fs.unlink(filePath).catch(
            (cleanupError) => {
              if (cleanupError.code !== 'ENOENT') {
                throw cleanupError;
              }
            }
          );
        }
      } catch (cleanupError) {
        console.error(
          'Uploaded file cleanup failed:',
          cleanupError
        );
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          'This media placement already exists. Please try again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload website media',
    });
  }
};

/**
 * PATCH: Activate or deactivate website media.
 */
export const updateWebsiteMediaStatus = async (
  req,
  res
) => {
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
      {
        new: true,
        runValidators: true,
      }
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
    console.error(
      'Update website media status error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update website media status',
    });
  }
};

/**
 * DELETE: Delete website media and its local file.
 */
export const deleteWebsiteMedia = async (req, res) => {
  try {
    const media = await WebsiteMedia.findById(
      req.params.id
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Website media not found',
      });
    }

    // Remove the database record.
    await media.deleteOne();

    // Remove the associated local file, if applicable.
    try {
      await deleteLocalMediaFile(media);
    } catch (cleanupError) {
      console.error(
        'Local website media cleanup failed:',
        cleanupError
      );

      return res.status(200).json({
        success: true,
        message:
          'Media record deleted, but its local file could not be removed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Website media deleted successfully',
    });
  } catch (error) {
    console.error(
      'Delete website media error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to delete website media',
    });
  }
};
