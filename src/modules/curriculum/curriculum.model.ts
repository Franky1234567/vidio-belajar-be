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
  const rows = await db`
    SELECT s.id, s.course_id, s.title, s."order",
      json_agg(
        json_build_object(
          'id', v.id,
          'title', v.title,
          'url', v.url,
          'duration', v.duration,
          'order', v."order"
        )
      ) AS videos
    FROM sections s
    LEFT JOIN videos v ON v.section_id = s.id
    WHERE s.course_id = ${course_id}
    GROUP BY s.id
    ORDER BY s."order" ASC`;
  return rows;
};

export const createSection = async (section: Section) => {
  const { course_id, title, order } = section;
  await db`INSERT INTO sections (course_id, title, "order") VALUES (${course_id}, ${title}, ${order ?? 1})`;
};

export const updateSection = async (id: number, data: Partial<Section>) => {
  const { title, order } = data;
  await db`UPDATE sections SET title = ${title}, "order" = ${order} WHERE id = ${id}`;
};

export const deleteSection = async (id: number) => {
  await db`DELETE FROM sections WHERE id = ${id}`;
};

// ─── VIDEOS ─────────────────────────────────────────────

export const createVideo = async (video: Video) => {
  const { section_id, title, url, duration, order } = video;
  await db`INSERT INTO videos (section_id, title, url, duration, "order") VALUES (${section_id}, ${title}, ${url}, ${duration ?? 0}, ${order ?? 1})`;
};

export const updateVideo = async (id: number, data: Partial<Video>) => {
  const { title, url, duration, order } = data;
  await db`UPDATE videos SET title = ${title}, url = ${url}, duration = ${duration}, "order" = ${order} WHERE id = ${id}`;
};

export const deleteVideo = async (id: number) => {
  await db`DELETE FROM videos WHERE id = ${id}`;
};