import { Router } from "express";
import { fetchPreview } from "../controllers/view";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();


// POST /api/preview  { url: "https://yourproject.com" }
// Returns { image, title, description, source }
router.post("/", authenticate, fetchPreview);

export default router;
