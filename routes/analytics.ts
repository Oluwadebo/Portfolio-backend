import { Router } from "express";
import { getAnalytics, trackVisit } from "../controllers/analytics";
import { authenticate } from "../middleware/authmiddleware";

const router = Router();

// ─── Public: called on every page load ─────────────
router.post("/visit", trackVisit);

// ─── Protected: only admin can read analytics ──────
router.get("/", authenticate, getAnalytics);

export default router;
