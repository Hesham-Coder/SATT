"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function deleteMessage(id: string) {
  await requireAuth();

  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    console.error("Delete message error:", error);
    return { error: "فشل الحذف" };
  }
}

export async function markAsRead(id: string, isRead: boolean) {
  await requireAuth();

  try {
    await prisma.message.update({ where: { id }, data: { isRead } });
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    return { error: "حدث خطأ" };
  }
}

