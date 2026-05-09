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
  const rows = await db`SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses`;
  return rows as Course[];
};

export const getCourseById = async (id: number) => {
  const rows = await db`SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses WHERE id = ${id}`;
  return rows[0] as Course | undefined;
};

export const getCoursesByCategory = async (category: string) => {
  const rows = await db`SELECT id, title, description, price, discount, thumbnail, category, instructor FROM courses WHERE category = ${category}`;
  return rows as Course[];
};

export const createCourse = async (course: Course) => {
  const { title, description, price, discount, thumbnail, category, instructor } = course;
  await db`INSERT INTO courses (title, description, price, discount, thumbnail, category, instructor) VALUES (${title}, ${description}, ${price}, ${discount}, ${thumbnail}, ${category}, ${instructor})`;
};

export const updateCourse = async (id: number, course: Partial<Course>) => {
  const { title, description, price, discount, thumbnail, category, instructor } = course;
  await db`UPDATE courses SET title = ${title}, description = ${description}, price = ${price}, discount = ${discount}, thumbnail = ${thumbnail}, category = ${category}, instructor = ${instructor} WHERE id = ${id}`;
};

export const deleteCourse = async (id: number) => {
  await db`DELETE FROM courses WHERE id = ${id}`;
};