"use server";

import prisma from "@/lib/db";
import { IMAGE_URL_VALIDATION_ERROR, sanitizeImageUrls } from "@/lib/validateImage";
import { revalidatePath } from "next/cache";

export async function deleteResearch(id: string) {
  try {
    await prisma.researchArticle.delete({ where: { id } });
    revalidatePath("/dashboard/research");
    revalidatePath("/research");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "فشل الحذف" };
  }
}

export async function saveResearch(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const abstract = formData.get("abstract") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const publishDate = formData.get("publishDate") as string;
    const category = formData.get("category") as string;
    const images = formData.get("images") as string;
    const imageList = images
      ? images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
      : [];

    if (imageList.length !== sanitizeImageUrls(imageList).length) {
      return { error: IMAGE_URL_VALIDATION_ERROR };
    }

    const data = {
      title,
      abstract,
      content,
      author,
      publishDate,
      category,
      images: JSON.stringify(sanitizeImageUrls(imageList)),
      videos: "[]",
    };

    if (id) {
      await prisma.researchArticle.update({ where: { id }, data });
    } else {
      await prisma.researchArticle.create({ data });
    }

    revalidatePath("/dashboard/research");
    revalidatePath("/research");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحفظ" };
  }
}
