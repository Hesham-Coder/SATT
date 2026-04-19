"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/[locale]/dashboard/login/actions";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/dashboard/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-[var(--color-error)] hover:text-red-700 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      تسجيل الخروج
    </button>
  );
}
