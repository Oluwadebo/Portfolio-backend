import { Request, Response } from "express";
import VisitorEvent from "../models/VisitorEvent";
import Project from "../models/Project";

export const trackVisit = async (req: Request, res: Response) => {
  try {
    await VisitorEvent.create({
      page: req.body.page || "/",
      userAgent: req.headers["user-agent"],
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to track visit" });
  }
};

export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalVisits = await VisitorEvent.countDocuments();

    const recentVisits = await VisitorEvent.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Daily visits grouped by date
    const dailyVisits = await VisitorEvent.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Project click stats
    const projects = await Project.find({}, { title: 1, clicks: 1 }).sort({
      createdAt: -1,
    });

    return res.json({ totalVisits, recentVisits, dailyVisits, projects });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
