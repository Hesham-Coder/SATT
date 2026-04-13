import { promises as fsPromises } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi"];
const ALL_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 150 * 1024 * 1024;

export type MediaFile = {
  filename: string;
  url: string;
  type: "image" | "video";
  size: number;
  updatedAt: string;
};

function getUploadsDir() {
  return path.join(process.cwd(), "uploads");
}

function getFileType(filename: string): MediaFile["type"] | null {
  const extension = path.extname(filename).toLowerCase();

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.includes(extension)) {
    return "video";
  }

  return null;
}

async function ensureUploadsDir() {
  await fsPromises.mkdir(getUploadsDir(), { recursive: true });
}

export async function listMediaFiles(): Promise<MediaFile[]> {
  await ensureUploadsDir();
  const files = await fsPromises.readdir(getUploadsDir());

  const entries = await Promise.all(
    files.map(async (filename) => {
      const type = getFileType(filename);

      if (!type) {
        return null;
      }

      const stats = await fsPromises.stat(path.join(getUploadsDir(), filename));

      return {
        filename,
        url: `/uploads/${filename}`,
        type,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
      } satisfies MediaFile;
    }),
  );

  return entries.filter((entry): entry is MediaFile => entry !== null).sort(
    (left, right) => right.updatedAt.localeCompare(left.updatedAt),
  );
}

export async function saveUploadedFile(file: File): Promise<MediaFile> {
  const extension = path.extname(file.name).toLowerCase();

  if (!ALL_EXTENSIONS.includes(extension)) {
    throw new Error("Unsupported file type.");
  }

  const type = getFileType(file.name);

  if (!type) {
    throw new Error("Unsupported file type.");
  }

  const maxBytes = type === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

  if (file.size > maxBytes) {
    throw new Error(type === "image" ? "حجم الصورة كبير جداً." : "حجم الفيديو كبير جداً.");
  }

  await ensureUploadsDir();

  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(getUploadsDir(), filename);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fsPromises.writeFile(filePath, buffer);
  const stats = await fsPromises.stat(filePath);

  return {
    filename,
    url: `/uploads/${filename}`,
    type,
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
  };
}

export async function deleteMediaFile(filename: string) {
  const safeName = path.basename(filename);
  await fsPromises.unlink(path.join(getUploadsDir(), safeName));
}