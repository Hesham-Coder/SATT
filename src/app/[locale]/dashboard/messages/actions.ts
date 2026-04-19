"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch {
    return { error: "فشل الحذف" };
  }
}

export async function markAsRead(id: string, isRead: boolean) {
  try {
    await prisma.message.update({ where: { id }, data: { isRead } });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch {
    return { error: "حدث خطأ" };
  }
}
