import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    school: {
      type: String,
      required: [true, 'School is required'],
      enum: {
        values: ['Sector 6', 'Sector 11'],
        message: 'Invalid school selected',
      },
    },

    year: {
      type: String,
      required: [true, 'Year is required'],
      match: [/^\d{4}$/, 'Year must be a valid 4-digit year'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },

    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },

    /*
     * Cloudinary public_id is required when we want
     * to delete/replace the file from Cloudinary later.
     */
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
      trim: true,
    },

    mediaType: {
      type: String,
      required: [true, 'Media type is required'],
      enum: {
        values: ['image', 'video'],
        message: 'Media type must be either image or video',
      },
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Indexes for faster gallery queries.
 */
gallerySchema.index({ school: 1, year: -1 });
gallerySchema.index({ category: 1 });
gallerySchema.index({ createdAt: -1 });

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

export default GalleryItem;