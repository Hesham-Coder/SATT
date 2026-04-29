"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function saveSettings(formData: FormData) {
  await requireAuth();

  try {
    const heroTitle = formData.get("heroTitle") as string;
    const heroTitleEn = formData.get("heroTitleEn") as string;
    const heroDesc = formData.get("heroDesc") as string;
    const heroDescEn = formData.get("heroDescEn") as string;
    const aboutText = formData.get("aboutText") as string;
    const aboutTextEn = formData.get("aboutTextEn") as string;
    const heroImageUrl = formData.get("heroImageUrl") as string;
    const showDoctorsSection = formData.get("showDoctorsSection") === "true";
    
    const data = {
      heroTitle,
      heroTitleEn,
      heroDesc,
      heroDescEn,
      aboutText,
      aboutTextEn,
      heroImageUrl,
      showDoctorsSection,
    };

    await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: data,
      create: { id: "settings", ...data },
    });

    revalidatePath("/");
    revalidatePath("/ar");
    revalidatePath("/en");
    revalidatePath("/dashboard/sections");
    return { success: true };
  } catch (error) {
    console.error("Save settings error:", error);
    return { error: "فشل الحفظ" };
  }
}

