import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./courses.controller";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Public — siapa aja bisa akses
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;