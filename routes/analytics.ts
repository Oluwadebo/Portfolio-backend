import { Router } from "express";
import { trackVisit, getAnalytics } from "../controllers/analytics";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// ─── Public: called on every page load ─────────────
router.post("/visit", trackVisit);

// ─── Protected: only admin can read analytics ──────
router.get("/", authenticate, getAnalytics);

export default router;
