import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  theme: {
    backgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
    fontFamily: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      trim: true,
    },
    avatar: {
      type: String,
    },
    theme: {
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
      buttonColor: {
        type: String,
        default: '#000000',
      },
      buttonTextColor: {
        type: String,
        default: '#ffffff',
      },
      fontFamily: {
        type: String,
        default: 'Inter',
      },
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
