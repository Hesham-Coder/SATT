"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "الرجاء إدخال البريد الإلكتروني وكلمة المرور." };
  }

  let user: { id: string; email: string; name: string | null; role: string; password: string } | null = null;

  try {
    user = await prisma.user.findUnique({ where: { email } });

    // For testing/bootstrap: Create an admin user if not exists.
    if (!user && email === "admin@satt.org" && password === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Admin",
          role: "admin",
        },
      });
    }

    if (!user) {
      return { error: "البريد الإلكتروني غير صحيح." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { error: "كلمة المرور غير صحيحة." };
    }
  } catch {
    // Keep non-production local/dev workflows available even if database is temporarily unavailable.
    if (
      process.env.NODE_ENV !== "production"
      && email === "admin@satt.org"
      && password === "admin"
    ) {
      user = {
        id: "local-admin",
        email,
        name: "Admin",
        role: "admin",
        password: "",
      };
    } else {
      return { error: "تعذر تسجيل الدخول حالياً. حاول مرة أخرى." };
    }
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
