"use client";

import { useState } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useTranslations } from "@/i18n/provider";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { locale } = useTranslations();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await login(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push(`/${locale}/dashboard`);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-muted)]" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] p-[var(--space-8)] shadow-lg ring-1 ring-[var(--color-border)]">
        <div className="mb-[var(--space-8)] text-center">
          <h1 className="text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
            تسجيل الدخول
          </h1>
          <p className="mt-[var(--space-2)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
            لوحة تحكم الجمعية العلمية للعلاج الموجه
          </p>
        </div>

        <form action={handleSubmit} className="space-y-[var(--space-6)]">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-[var(--space-4)]">
            <Input
              id="email"
              name="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="admin@satt.org"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="كلمة المرور"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            دخول للوحة التحكم
          </Button>
        </form>
      </div>
    </div>
  );
}
