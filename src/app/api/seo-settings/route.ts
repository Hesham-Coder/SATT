import { NextResponse } from "next/server";

import { getSeoSettings } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSeoSettings();

  return NextResponse.json({
    data: settings,
    source: "cms-or-fallback",
  });
}
