import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload";
import { authenticate } from "../middleware/auth.middleware";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, WEBP allowed"));
  },
});

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadImage);

export default router;
