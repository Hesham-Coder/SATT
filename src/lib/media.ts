import { randomUUID } from "node:crypto";
import { promises as fsPromises } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const VIDEO_EXTENSIONS = [".mp4"];
const ALL_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 150 * 1024 * 1024;

export type MediaFile = {
  filename: string;
  url: string;
  type: "image" | "video";
  size: number;
  updatedAt: string;
  width?: number;
  height?: number;
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
      let width: number | undefined;
      let height: number | undefined;

      if (type === "image") {
        const metadata = await sharp(path.join(getUploadsDir(), filename)).metadata();
        width = metadata.width;
        height = metadata.height;
      }

      return {
        filename,
        url: `/uploads/${filename}`,
        type,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
        width,
        height,
      } satisfies MediaFile;
    }),
  );

  return (entries.filter((entry) => entry !== null) as MediaFile[]).sort(
    (left, right) => right.updatedAt.localeCompare(left.updatedAt),
  );
}

async function optimizeImageBuffer(buffer: Buffer) {
  // Normalize orientation and compress uploads aggressively for faster delivery.
  return sharp(buffer)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

export async function saveUploadedFile(file: File): Promise<MediaFile> {
  const extension = path.extname(file.name).toLowerCase();

  if (!ALL_EXTENSIONS.includes(extension)) {
    throw new Error("Unsupported file type. Allowed: jpg, jpeg, png, webp, mp4.");
  }

  const type = getFileType(file.name);

  if (!type) {
    throw new Error("Unsupported file type.");
  }

  const maxBytes = type === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;

  if (file.size > maxBytes) {
    throw new Error(type === "image" ? "Image file is too large." : "Video file is too large.");
  }

  await ensureUploadsDir();

  const initialBuffer = Buffer.from(await file.arrayBuffer());
  const finalBuffer = type === "image" ? await optimizeImageBuffer(initialBuffer) : initialBuffer;
  const finalExtension = type === "image" ? ".webp" : ".mp4";
  const filename = `${Date.now()}-${randomUUID()}${finalExtension}`;
  const filePath = path.join(getUploadsDir(), filename);

  await fsPromises.writeFile(filePath, finalBuffer);
  const stats = await fsPromises.stat(filePath);
  let width: number | undefined;
  let height: number | undefined;

  if (type === "image") {
    const metadata = await sharp(filePath).metadata();
    width = metadata.width;
    height = metadata.height;
  }

  return {
    filename,
    url: `/uploads/${filename}`,
    type,
    size: stats.size,
    updatedAt: stats.mtime.toISOString(),
    width,
    height,
  };
}

export async function deleteMediaFile(filename: string) {
  const safeName = path.basename(filename);
  await fsPromises.unlink(path.join(getUploadsDir(), safeName));
}
