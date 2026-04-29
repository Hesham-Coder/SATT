"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { encrypt } from "@/lib/auth";
import prisma from "@/lib/db";

const LOGIN_REQUIRED_ERROR = "الرجاء إدخال البريد الإلكتروني وكلمة المرور.";
const LOGIN_FAILED_ERROR = "بيانات تسجيل الدخول غير صحيحة.";
const LOGIN_UNAVAILABLE_ERROR = "تعذر تسجيل الدخول حالياً. حاول مرة أخرى.";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: LOGIN_REQUIRED_ERROR };
  }

  let user: { id: string; email: string; name: string | null; role: string; password: string } | null = null;

  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    return { error: LOGIN_UNAVAILABLE_ERROR };
  }

  if (!user) {
    return { error: LOGIN_FAILED_ERROR };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: LOGIN_FAILED_ERROR };
  }

  const sessionData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };

  const encryptedSession = await encrypt(sessionData);
  const cookieStore = await cookies();
  cookieStore.set("session", encryptedSession, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
