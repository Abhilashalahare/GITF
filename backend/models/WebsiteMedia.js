
import mongoose from 'mongoose';

const websiteMediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Media name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },

    // Unique placement across the entire website
    // Examples: home/hero, about/intro, admissions/banner
    key: {
      type: String,
      required: [true, 'Media key is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },

    section: {
      type: String,
      required: [true, 'Website section is required'],
      enum: {
        values: [
          'home',
          'about',
          'learning-development',
          'programmes-activities',
          'our-people',
          'parents-students',
          'admissions',
        ],
        message: 'Invalid website section',
      },
    },

    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },

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
        message: 'Media type must be image or video',
      },
    },

    altText: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Alt text cannot exceed 300 characters'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Quickly retrieve media by website section.
websiteMediaSchema.index({ section: 1, isActive: 1 });

const WebsiteMedia = mongoose.model(
  'WebsiteMedia',
  websiteMediaSchema
);

export default WebsiteMedia;
