"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/[locale]/dashboard/login/actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/i18n/provider";

export function LogoutButton() {
  const router = useRouter();
  const { locale } = useTranslations();

  async function handleLogout() {
    await logout();
    router.replace(`/${locale}/dashboard/login`);
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-[var(--color-error)] hover:text-red-700 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      {locale === "ar" ? "تسجيل الخروج" : "Logout"}
    </button>
  );
}

