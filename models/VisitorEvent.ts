import mongoose, { Schema, Document } from "mongoose";

export interface IVisitorEvent extends Document {
  page: string;
  userAgent?: string;
  createdAt: Date;
}

const VisitorEventSchema = new Schema<IVisitorEvent>(
  {
    page: { type: String, default: "/" },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IVisitorEvent>("VisitorEvent", VisitorEventSchema);
