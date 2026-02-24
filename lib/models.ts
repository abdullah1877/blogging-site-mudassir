import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  // Fixed: changed from 'categories' to 'category' to match the schema
  category: 'Cement Industry' | 'Power Plant' | 'Condition Monitoring' | 'Lubrication' | 'NDT';
  content: string;
  excerpt: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  imageUrl?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IManual extends Document {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  documentUrl?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

// --- Schemas ---

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    // This now matches the IBlog interface perfectly
    category: { 
      type: String, 
      enum: ['Cement Industry', 'Power Plant', 'Condition Monitoring', 'Lubrication', 'NDT'], 
      required: true 
    },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    imageUrl: String,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const manualSchema = new Schema<IManual>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    documentUrl: String,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
);

// --- Indexes ---
blogSchema.index({ slug: 1 });
manualSchema.index({ slug: 1 });

// --- Models ---
// We use the pattern: check if model exists, if not, create it.

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export const Manual: Model<IManual> =
  mongoose.models.Manual || mongoose.model<IManual>('Manual', manualSchema);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);