import { Request, Response } from "express";
import { getURLPreview } from "../lib/view";

export const fetchPreview = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const preview = await getURLPreview(url);
    return res.json(preview);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch preview" });
  }
};
