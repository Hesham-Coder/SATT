import { NextResponse } from "next/server";

import { getConferenceById } from "@/data/conferences";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { normalizeConferencePayload } from "@/lib/conferences";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const conference = await getConferenceById(id);

  if (!conference) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: conference });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();

  try {
    await prisma.conference.update({
      where: { id },
      data: normalizeConferencePayload(payload),
    });

    const conference = await getConferenceById(id);
    return NextResponse.json({ data: conference });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update conference" },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.conference.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete conference" }, { status: 400 });
  }
}