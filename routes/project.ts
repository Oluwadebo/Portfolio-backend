import { Router } from "express";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  trackProjectClick,
} from "../controllers/project";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// ─── Public ────────────────────────────────────────
router.get("/", getAllProjects);
router.post("/:id/click", trackProjectClick); // track link clicks

// ─── Protected (admin only) ────────────────────────
router.post("/", authenticate, createProject);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);

export default router;
