import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILink extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  order: number;
  active: boolean;
  clicks: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Link title is required'],
      trim: true,
      maxlength: [80, 'Title cannot exceed 80 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
LinkSchema.index({ userId: 1, order: 1 });

const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;
