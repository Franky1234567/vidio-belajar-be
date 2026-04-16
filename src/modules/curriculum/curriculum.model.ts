import db from "../../config/db";

export interface Section {
  id?: number;
  course_id: number;
  title: string;
  order?: number;
}

export interface Video {
  id?: number;
  section_id: number;
  title: string;
  url: string;
  duration?: number;
  order?: number;
}

// ─── SECTIONS ───────────────────────────────────────────

export const getSectionsByCourse = async (course_id: number) => {
  const [rows] = await db.query(
    `SELECT s.id, s.course_id, s.title, s.order,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', v.id,
          'title', v.title,
          'url', v.url,
          'duration', v.duration,
          'order', v.order
        )
      ) AS videos
    FROM sections s
    LEFT JOIN videos v ON v.section_id = s.id
    WHERE s.course_id = ?
    GROUP BY s.id
    ORDER BY s.order ASC`,
    [course_id]
  );
  return rows;
};

export const createSection = async (section: Section) => {
  const { course_id, title, order } = section;
  const [result] = await db.query(
    "INSERT INTO sections (course_id, title, `order`) VALUES (?, ?, ?)",
    [course_id, title, order ?? 1]
  );
  return result;
};

export const updateSection = async (id: number, data: Partial<Section>) => {
  const { title, order } = data;
  const [result] = await db.query(
    "UPDATE sections SET title = ?, `order` = ? WHERE id = ?",
    [title, order, id]
  );
  return result;
};

export const deleteSection = async (id: number) => {
  const [result] = await db.query("DELETE FROM sections WHERE id = ?", [id]);
  return result;
};

// ─── VIDEOS ─────────────────────────────────────────────

export const createVideo = async (video: Video) => {
  const { section_id, title, url, duration, order } = video;
  const [result] = await db.query(
    "INSERT INTO videos (section_id, title, url, duration, `order`) VALUES (?, ?, ?, ?, ?)",
    [section_id, title, url, duration ?? 0, order ?? 1]
  );
  return result;
};

export const updateVideo = async (id: number, data: Partial<Video>) => {
  const { title, url, duration, order } = data;
  const [result] = await db.query(
    "UPDATE videos SET title = ?, url = ?, duration = ?, `order` = ? WHERE id = ?",
    [title, url, duration, order, id]
  );
  return result;
};

export const deleteVideo = async (id: number) => {
  const [result] = await db.query("DELETE FROM videos WHERE id = ?", [id]);
  return result;
};
