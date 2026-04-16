import db from "../../config/db";

export interface Course {
  id?: number;
  title: string;
  description?: string;
  price: number;
  discount?: number;
  thumbnail?: string;
  category?: string;
  instructor?: string;
}

export const getAllCourses = async () => {
  const [rows] = await db.query(
    "SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses"
  );
  return rows as Course[];
};

export const getCourseById = async (id: number) => {
  const [rows] = await db.query(
    "SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses WHERE id = ?",
    [id]
  );
  return (rows as Course[])[0];
};

export const getCoursesByCategory = async (category: string) => {
  const [rows] = await db.query(
    "SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses WHERE category = ?",
    [category]
  );
  return rows as Course[];
};

export const createCourse = async (course: Course) => {
  const { title, description, price, discount, thumbnail, category, instructor } = course;
  const [result] = await db.query(
    "INSERT INTO courses (title, description, price, discount, thumbnail, category, instructor) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, description, price, discount, thumbnail, category, instructor]
  );
  return result;
};

export const updateCourse = async (id: number, course: Partial<Course>) => {
  const { title, description, price, discount, thumbnail, category, instructor } = course;
  const [result] = await db.query(
    "UPDATE courses SET title = ?, description = ?, price = ?, discount = ?, thumbnail = ?, category = ?, instructor = ? WHERE id = ?",
    [title, description, price, discount, thumbnail, category, instructor, id]
  );
  return result;
};

export const deleteCourse = async (id: number) => {
  const [result] = await db.query("DELETE FROM courses WHERE id = ?", [id]);
  return result;
};