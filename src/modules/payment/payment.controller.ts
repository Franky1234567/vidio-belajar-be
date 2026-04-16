import { Request, Response } from "express";
import crypto from "crypto";
// import midtransClient from "midtrans-client";
const midtransClient = require("midtrans-client");
import { AuthRequest } from "../../middleware/auth.middleware";
import { createOrder, getOrderByMidtransId, updateOrderStatus, getOrdersByUser, getPaidOrderByUserAndCourse, getAllOrders } from "./payment.model";
import { getCourseById } from "../courses/courses.model";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user!.id;

    const course = await getCourseById(course_id);
    if (!course) {
      res.status(404).json({ message: "Course tidak ditemukan" });
      return;
    }

    const alreadyPaid = await getPaidOrderByUserAndCourse(user_id, course_id);
    if (alreadyPaid) {
      res.status(400).json({ message: "Kamu sudah memiliki course ini" });
      return;
    }

    const discount = course.discount ?? 0;
    const amount = course.price - (course.price * discount) / 100;
    const midtrans_order_id = `ORDER-${user_id}-${course_id}-${Date.now()}`;

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtrans_order_id,
        gross_amount: amount,
      },
      customer_details: {
        email: req.user!.email,
      },
    } as any);

    await createOrder({ user_id, course_id, amount, midtrans_order_id });

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      midtrans_order_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = req.body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      res.status(403).json({ message: "Invalid signature" });
      return;
    }

    const order = await getOrderByMidtransId(order_id);
    if (!order) {
      res.status(404).json({ message: "Order tidak ditemukan" });
      return;
    }

    let status = "pending";
    if (transaction_status === "capture" && fraud_status === "accept") {
      status = "paid";
    } else if (transaction_status === "settlement") {
      status = "paid";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      status = "failed";
    }

    await updateOrderStatus(order_id, status);
    res.json({ message: "Webhook received" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getOrdersByUser(req.user!.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrdersHandler = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkAccess = async (req: AuthRequest, res: Response) => {
  try {
    const course_id = Number(req.params.course_id);
    const paid = await getPaidOrderByUserAndCourse(req.user!.id, course_id);
    res.json({ hasAccess: !!paid });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};