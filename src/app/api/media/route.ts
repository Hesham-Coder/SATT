import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { listMediaFiles, saveUploadedFile } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const files = await listMediaFiles();

    return NextResponse.json({
      images: files.filter((file) => file.type === "image"),
      videos: files.filter((file) => file.type === "video"),
    });
  } catch (error) {
    console.error("Failed to read uploads directory:", error);
    return NextResponse.json({ images: [], videos: [] });
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  try {
    const uploaded = await saveUploadedFile(file);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
