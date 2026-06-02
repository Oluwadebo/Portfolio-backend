import { Request, Response } from "express";
import Project from "../models/Project";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const result = projectSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  try {
    const project = await Project.create(result.data);
    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = projectSchema.partial().safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  try {
    const project = await Project.findByIdAndUpdate(id, result.data, {
      new: true,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Project.findByIdAndDelete(id);
    return res.json({ message: "Project deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete project" });
  }
};

export const trackProjectClick = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!["live", "github"].includes(type)) {
    return res.status(400).json({ error: "type must be live or github" });
  }

  try {
    await Project.findByIdAndUpdate(id, { $inc: { [`clicks.${type}`]: 1 } });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to track click" });
  }
};
