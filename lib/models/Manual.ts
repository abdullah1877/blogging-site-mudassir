import mongoose from 'mongoose';

const manualSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
  type: String,
  enum: ['software', 'hardware', 'installation', 'troubleshooting', 'reference', 'Getting Started'],
  default: 'reference',
},
    author: {
  type: String,
  default: "demo-user",
},
excerpt: {
  type: String,
  required: false,
},  
slug: {
  type: String,
  required: true,
  unique: true, 
  lowercase: true,
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

// ❌ REMOVE duplicate slug index
// manualSchema.index({ slug: 1 });

manualSchema.index({ category: 1 });
manualSchema.index({ createdAt: -1 });

export const Manual =
  mongoose.models.Manual || mongoose.model('Manual', manualSchema);