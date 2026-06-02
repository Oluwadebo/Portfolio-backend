import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/Settings";
import { authenticate } from "../middleware/authmiddleware";

const router = Router();

router.get("/", getSettings); // public
router.put("/", authenticate, updateSettings); // admin only

export default router;
