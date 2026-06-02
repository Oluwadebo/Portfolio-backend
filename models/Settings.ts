import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  displayName: string;
  role: string;
  bio: string;
  available: boolean;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "OD.DEV" },
    displayName: { type: String, default: "Ogunwe Debo" },
    role: { type: String, default: "Full Stack Developer" },
    bio: {
      type: String,
      default: "I build fast, scalable, production-ready web applications.",
    },
    available: { type: Boolean, default: true },
    email: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
