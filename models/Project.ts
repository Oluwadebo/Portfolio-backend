import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  featured: boolean;
  order: number;
  clicks: {
    live: number;
    github: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    clicks: {
      live: { type: Number, default: 0 },
      github: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
