import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { deleteMediaFile } from "@/lib/media";

type Params = {
  params: Promise<{ filename: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  try {
    await deleteMediaFile(filename);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 400 },
    );
  }
}