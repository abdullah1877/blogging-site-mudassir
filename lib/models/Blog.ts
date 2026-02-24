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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Cement Industry', 'Power Plant', 'Condition Monitoring', 'Lubrication' , 'NDT'],
      default: 'technical',
    },
    author: {
      type: String,
      default: "demo-user",
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });

export const Blog =
  mongoose.models.Blog || mongoose.model('Blog', blogSchema);