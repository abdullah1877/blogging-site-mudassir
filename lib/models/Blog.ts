import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // ✅ SUPPORT OLD DB
    description: {
      type: String,
    },

    featuredImage: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },

    // ✅ SUPPORT NEW DB
 excerpt: {
  type: String,
  get: function (value: string): string {
    return value || this.description;
  },
},
  content: {
  type: String,
},

  category: {
  type: String,
  enum: [
    'Cement Industry',
    'Power Plant',
    'Condition Monitoring',
    'Lubrication',
    'NDT',
    'Technical'
  ],
  default: 'Cement Industry',
},

  author: {
  type: String,
  default: 'demo-user',
},

  views: {
  type: Number,
  default: 0,
},

  featured: {
  type: Boolean,
  default: false,
},

imageUrl: {
  type: String,
  get: function (this: any, value: string): string {
    return value || this.featuredImage;
  },
},
  },
{
  collection: 'blogs',
    timestamps: true,
      toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
}
);

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });

export const Blog =
  mongoose.models.Blog || mongoose.model('Blog', blogSchema);