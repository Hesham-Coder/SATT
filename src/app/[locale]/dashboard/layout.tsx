import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Home, FileText, Settings, Users, MessageSquare, MonitorPlay } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]" dir="rtl">
      {/* Sidebar */}
      {session && (
      <aside className="w-64 flex-shrink-0 bg-white border-l border-[var(--color-border)] shadow-sm">
        <div className="flex h-16 items-center justify-center border-b border-[var(--color-border)] px-4">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">SATT Admin</h2>
        </div>
        <nav className="space-y-1 p-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <Home className="h-4 w-4" />
            نظرة عامة
          </Link>
          <Link href="/dashboard/conferences" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <Users className="h-4 w-4" />
            المؤتمرات
          </Link>
          <Link href="/dashboard/research" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <FileText className="h-4 w-4" />
            الأبحاث
          </Link>
          <Link href="/dashboard/media" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <MonitorPlay className="h-4 w-4" />
            إدارة الميديا
          </Link>
          <Link href="/dashboard/sections" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <Settings className="h-4 w-4" />
            محتوى الواجهة
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:text-black">
            <MessageSquare className="h-4 w-4" />
            رسائل التواصل
          </Link>
        </nav>
      </aside>
      )}

      {/* Main Content */}
      <div className={session ? "flex flex-1 flex-col overflow-hidden" : "w-full"}>
        {/* Topbar */}
        {session && (
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white px-6">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">أهلاً بك، {session?.user?.name || 'مستخدم'}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              عرض الموقع
            </Link>
            <LogoutButton />
          </div>
        </header>
        )}

        {/* Dynamic Content */}
        <main className={session ? "flex-1 overflow-y-auto p-4 md:p-8" : "w-full"}>
          {children}
        </main>
      </div>
    </div>
  );
}
