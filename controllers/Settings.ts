import { Request, Response } from "express";
import Settings from "../models/Settings";

console.log("i am in setting");

// ─── Get settings (public) ──────────────────────────
export const getSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist yet, create defaults
    if (!settings) {
      settings = await Settings.create({});
    }

    return res.json(settings);
  } catch (err) {
    console.error(err);
    console.error("SETTINGS ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// ─── Update settings (protected) ───────────────────
export const updateSettings = async (req: Request, res: Response) => {
  const allowed = [
    "siteName",
    "displayName",
    "role",
    "bio",
    "available",
    "email",
    "github",
    "linkedin",
    "twitter",
  ];

  // Only pick allowed fields
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key)),
  );

  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true },
    );
    return res.json(settings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update settings" });
  }
};
