import db from "../../config/db";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: "user" | "admin";
}

export const findUserByEmail = async (email: string) => {
  const [rows] = await db.query(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email]
  );
  return (rows as User[])[0];
};

export const createUser = async (user: User) => {
  const { name, email, password } = user;
  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result;
};

export const findUserById = async (id: number) => {
  const [rows] = await db.query("SELECT id, name, email, phone, avatar, role FROM users WHERE id = ?", [id]);
  return (rows as User[])[0];
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const { name, phone, avatar } = data;
  const [result] = await db.query(
    "UPDATE users SET name = ?, phone = ?, avatar = ? WHERE id = ?",
    [name, phone, avatar, id]
  );
  return result;
};