import { Router } from "express";
import {
  getCurriculum,
  addSection,
  editSection,
  removeSection,
  addVideo,
  editVideo,
  removeVideo,
} from "./curriculum.controller";
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Struktur kurikulum publik, tapi URL video hanya untuk yang sudah bayar
router.get("/course/:course_id", optionalAuthMiddleware, getCurriculum);

// Admin only
router.post("/sections", authMiddleware, adminMiddleware, addSection);
router.put("/sections/:id", authMiddleware, adminMiddleware, editSection);
router.delete("/sections/:id", authMiddleware, adminMiddleware, removeSection);

router.post("/videos", authMiddleware, adminMiddleware, addVideo);
router.put("/videos/:id", authMiddleware, adminMiddleware, editVideo);
router.delete("/videos/:id", authMiddleware, adminMiddleware, removeVideo);

export default router;
