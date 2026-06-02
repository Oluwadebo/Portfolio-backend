import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio/projects", resource_type: "image" },
          (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    return res.json({ url: result.secure_url });
  } catch (err) {
    return res.status(500).json({ error: "Upload failed" });
  }
};
