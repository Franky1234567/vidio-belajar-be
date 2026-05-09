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
  const rows = await db`SELECT id, name, email, password, role FROM users WHERE email = ${email}`;
  return rows[0] as User | undefined;
};

export const createUser = async (user: User) => {
  const { name, email, password } = user;
  await db`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${password})`;
};

export const findUserById = async (id: number) => {
  const rows = await db`SELECT id, name, email, phone, avatar, role FROM users WHERE id = ${id}`;
  return rows[0] as User | undefined;
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const { name, phone, avatar } = data;
  await db`UPDATE users SET name = ${name}, phone = ${phone}, avatar = ${avatar} WHERE id = ${id}`;
};