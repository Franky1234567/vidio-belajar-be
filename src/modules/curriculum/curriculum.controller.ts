import { Request, Response } from "express";
import {
  getSectionsByCourse,
  createSection,
  updateSection,
  deleteSection,
  createVideo,
  updateVideo,
  deleteVideo,
} from "./curriculum.model";
import { getPaidOrderByUserAndCourse } from "../payment/payment.model";
import { AuthRequest } from "../../middleware/auth.middleware";

// ─── SECTIONS ───────────────────────────────────────────

export const getCurriculum = async (req: AuthRequest, res: Response) => {
  try {
    const course_id = Number(req.params.course_id);
    const sections = await getSectionsByCourse(course_id) as any[];

    // Cek apakah user sudah bayar course ini
    let hasPaid = false;
    if (req.user) {
      const paid = await getPaidOrderByUserAndCourse(req.user.id, course_id);
      hasPaid = !!paid;
    }

    // Kalau belum bayar, sembunyikan URL video
    const result = sections.map((section: any) => ({
      ...section,
      videos: section.videos?.map((video: any) => ({
        ...video,
        url: hasPaid ? video.url : null,
      })) || [],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addSection = async (req: Request, res: Response) => {
  try {
    const { course_id, title, order } = req.body;
    await createSection({ course_id, title, order });
    res.status(201).json({ message: "Section berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const editSection = async (req: Request, res: Response) => {
  try {
    await updateSection(Number(req.params.id), req.body);
    res.json({ message: "Section berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSection = async (req: Request, res: Response) => {
  try {
    await deleteSection(Number(req.params.id));
    res.json({ message: "Section berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── VIDEOS ─────────────────────────────────────────────

export const addVideo = async (req: Request, res: Response) => {
  try {
    const { section_id, title, url, duration, order } = req.body;
    await createVideo({ section_id, title, url, duration, order });
    res.status(201).json({ message: "Video berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const editVideo = async (req: Request, res: Response) => {
  try {
    await updateVideo(Number(req.params.id), req.body);
    res.json({ message: "Video berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeVideo = async (req: Request, res: Response) => {
  try {
    await deleteVideo(Number(req.params.id));
    res.json({ message: "Video berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
