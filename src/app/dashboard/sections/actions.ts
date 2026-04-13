"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  try {
    const heroTitle = formData.get("heroTitle") as string;
    const heroDesc = formData.get("heroDesc") as string;
    const aboutText = formData.get("aboutText") as string;

    const data = {
      heroTitle,
      heroDesc,
      aboutText,
    };

    await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: data,
      create: { id: "settings", ...data },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/sections");
    return { success: true };
  } catch {
    return { error: "فشل الحفظ" };
  }
}
