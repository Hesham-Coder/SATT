"use server";

import prisma from "@/lib/db";
import { normalizeConferencePayload } from "@/lib/conferences";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function deleteConference(id: string) {
  await requireAuth();

  try {
    await prisma.conference.delete({ where: { id } });
    revalidatePath("/dashboard/conferences");
    revalidatePath("/conferences");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete conference error:", error);
    return { error: "فشل الحذف" };
  }
}

export async function saveConference(formData: FormData) {
  await requireAuth();

  try {
    const id = formData.get("id") as string;
    const data = normalizeConferencePayload({
      id,
      title: {
        ar: String(formData.get("titleAr") || ""),
        en: String(formData.get("titleEn") || ""),
      },
      description: {
        ar: String(formData.get("descriptionAr") || ""),
        en: String(formData.get("descriptionEn") || ""),
      },
      shortDescription: {
        ar: String(formData.get("shortDescriptionAr") || ""),
        en: String(formData.get("shortDescriptionEn") || ""),
      },
      date: String(formData.get("date") || ""),
      location: {
        ar: String(formData.get("locationAr") || ""),
        en: String(formData.get("locationEn") || ""),
      },
      category: {
        key: String(formData.get("categoryKey") || ""),
        label: {
          ar: String(formData.get("categoryAr") || ""),
          en: String(formData.get("categoryEn") || ""),
        },
      },
      images: JSON.parse(String(formData.get("images") || "[]")),
      videos: JSON.parse(String(formData.get("videos") || "[]")),
      tags: {
        ar: JSON.parse(String(formData.get("tagsAr") || "[]")),
        en: JSON.parse(String(formData.get("tagsEn") || "[]")),
      },
    });

    if (id) {
      await prisma.conference.update({ where: { id }, data });
    } else {
      await prisma.conference.create({ data });
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath("/conferences");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Save conference error:", error);
    return { error: "حدث خطأ أثناء الحفظ" };
  }
}

