import { NextResponse } from "next/server";

import { getConferences } from "@/data/conferences";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { normalizeConferencePayload } from "@/lib/conferences";

export const dynamic = "force-dynamic";

export async function GET() {
  const conferences = await getConferences();
  return NextResponse.json({ data: conferences });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  try {
    const created = await prisma.conference.create({
      data: normalizeConferencePayload(payload),
    });

    const conferences = await getConferences();
    const conference = conferences.find((item) => item.id === created.id);

    return NextResponse.json({ data: conference }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create conference" },
      { status: 400 },
    );
  }
}