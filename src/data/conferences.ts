import prisma from "@/lib/db";
import {
  mapConferenceRecord,
  type ConferenceRecord,
} from "@/lib/conferences";
import type { Conference } from "@/types/conference";

export async function getConferences(): Promise<Conference[]> {
  try {
    const raw = await prisma.conference.findMany({
      orderBy: { createdAt: "desc" },
    });

    return raw.map((conference) =>
      mapConferenceRecord(conference as ConferenceRecord),
    );
  } catch {
    return [];
  }
}

export async function getConferenceById(id: string): Promise<Conference | null> {
  try {
    const record = await prisma.conference.findUnique({ where: { id } });
    return record ? mapConferenceRecord(record as ConferenceRecord) : null;
  } catch {
    return null;
  }
}
