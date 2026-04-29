"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export async function saveDoctor(formData: FormData) {
  await requireAuth();

  const id = formData.get("id") as string;
  const nameAr = (formData.get("nameAr") as string)?.trim();
  const nameEn = (formData.get("nameEn") as string)?.trim();
  const roleAr = (formData.get("roleAr") as string)?.trim();
  const roleEn = (formData.get("roleEn") as string)?.trim();
  const focusAr = (formData.get("focusAr") as string)?.trim();
  const focusEn = (formData.get("focusEn") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const order = parseInt(formData.get("order") as string || "0");

  if (!nameAr && !nameEn) {
    throw new Error("Name is required in at least one language");
  }

  const data = {
    name: nameAr || nameEn || "Unnamed Doctor",
    nameAr,
    nameEn,
    role: roleAr || roleEn || "Medical Staff",
    roleAr,
    roleEn,
    focus: focusAr || focusEn || "General Medicine",
    focusAr,
    focusEn,
    image,
    order: isNaN(order) ? 0 : order,
  };

  try {
    if (id) {
      await prisma.doctor.update({
        where: { id },
        data,
      });
    } else {
      await prisma.doctor.create({
        data,
      });
    }
  } catch (error) {
    console.error("Database error in saveDoctor:", error);
    throw new Error("Failed to save doctor information");
  }

  revalidatePath("/");
  revalidatePath("/dashboard/doctors");
  redirect("/dashboard/doctors");
}

export async function deleteDoctor(id: string) {
  await requireAuth();

  try {
    await prisma.doctor.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error in deleteDoctor:", error);
    throw new Error("Failed to delete doctor");
  }
  
  revalidatePath("/");
  revalidatePath("/dashboard/doctors");
}

