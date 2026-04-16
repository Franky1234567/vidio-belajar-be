import { Request, Response } from "express";
import { getAllCourses, getCourseById, getCoursesByCategory, createCourse, updateCourse, deleteCourse } from "./courses.model";
import { AuthRequest } from "../../middleware/auth.middleware";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const courses = category
      ? await getCoursesByCategory(category as string)
      : await getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const course = await getCourseById(Number(req.params.id));
    if (!course) {
      res.status(404).json({ message: "Course tidak ditemukan" });
      return;
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    await createCourse(req.body);
    res.status(201).json({ message: "Course berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    await updateCourse(Number(req.params.id), req.body);
    res.json({ message: "Course berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await deleteCourse(Number(req.params.id));
    res.json({ message: "Course berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};