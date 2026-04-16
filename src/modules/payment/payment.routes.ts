import { Router } from "express";
import { createPayment, handleWebhook, getMyOrders, getAllOrdersHandler, checkAccess } from "./payment.controller";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createPayment);
router.post("/webhook", handleWebhook);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/all-orders", authMiddleware, adminMiddleware, getAllOrdersHandler);
router.get("/check-access/:course_id", authMiddleware, checkAccess);

export default router;