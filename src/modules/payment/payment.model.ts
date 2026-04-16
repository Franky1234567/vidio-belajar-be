import db from "../../config/db";

export interface Order {
  id?: number;
  user_id: number;
  course_id: number;
  amount: number;
  status?: "pending" | "paid" | "failed";
  payment_method?: string;
  midtrans_order_id?: string;
}

export const createOrder = async (order: Order) => {
  const { user_id, course_id, amount, midtrans_order_id } = order;
  const [result] = await db.query(
    "INSERT INTO orders (user_id, course_id, amount, midtrans_order_id) VALUES (?, ?, ?, ?)",
    [user_id, course_id, amount, midtrans_order_id]
  );
  return result;
};

export const getOrderByMidtransId = async (midtrans_order_id: string) => {
  const [rows] = await db.query(
    "SELECT id, user_id, course_id, amount, status, midtrans_order_id FROM orders WHERE midtrans_order_id = ?",
    [midtrans_order_id]
  );
  return (rows as Order[])[0];
};

export const updateOrderStatus = async (midtrans_order_id: string, status: string) => {
  const [result] = await db.query(
    "UPDATE orders SET status = ? WHERE midtrans_order_id = ?",
    [status, midtrans_order_id]
  );
  return result;
};

export const getPaidOrderByUserAndCourse = async (user_id: number, course_id: number) => {
  const [rows] = await db.query(
    "SELECT id FROM orders WHERE user_id = ? AND course_id = ? AND status = 'paid'",
    [user_id, course_id]
  );
  return (rows as Order[])[0];
};

export const getAllOrders = async () => {
  const [rows] = await db.query(
    `SELECT o.id, o.amount, o.status, o.midtrans_order_id, o.created_at,
     c.title, c.thumbnail
     FROM orders o
     JOIN courses c ON o.course_id = c.id
     ORDER BY o.created_at DESC`
  );
  return rows;
};

export const getOrdersByUser = async (user_id: number) => {
  const [rows] = await db.query(
    `SELECT o.id, o.amount, o.status, o.midtrans_order_id, o.created_at,
     c.title, c.thumbnail, c.instructor
     FROM orders o
     JOIN courses c ON o.course_id = c.id
     WHERE o.user_id = ?`,
    [user_id]
  );
  return rows;
};