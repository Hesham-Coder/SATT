"use client";

import { useState } from "react";
import { saveSettings } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SiteSettingsData = { 
  heroTitle?: string; 
  heroTitleAr?: string | null;
  heroTitleEn?: string | null; 
  heroDesc?: string; 
  heroDescAr?: string | null;
  heroDescEn?: string | null; 
  aboutText?: string; 
  aboutTextAr?: string | null;
  aboutTextEn?: string | null; 
  heroImageUrl?: string | null; 
  [key: string]: unknown 
} | null;

export function SectionsManager({ initialData }: { initialData: SiteSettingsData }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await saveSettings(formData);
    setLoading(false);
    alert("تم حفظ الإعدادات بنجاح");
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm max-w-4xl">
      <h2 className="mb-6 text-xl font-bold">محتوى واجهة الموقع</h2>
      <form action={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary)]">قسم الواجهة (Hero)</h3>
          
          <div className="space-y-4">
            <Input
              label="رابط صورة الواجهة (Hero Image URL)"
              name="heroImageUrl"
              defaultValue={initialData?.heroImageUrl || ""}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="العنوان الرئيسي (عربي)"
              name="heroTitle"
              defaultValue={initialData?.heroTitle || "منظومة متكاملة لخدمة المتخصصين في مجال طب الأورام الحديث."}
              required
            />
            <Input
              label="العنوان الرئيسي (إنجليزي)"
              name="heroTitleEn"
              defaultValue={initialData?.heroTitleEn || "Integrated system to serve modern oncology specialists."}
              className="text-left dir-ltr"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-[var(--space-2)]">
              <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                الوصف (عربي)
              </label>
              <textarea
                name="heroDesc"
                defaultValue={initialData?.heroDesc || "نعمل على بناء جسور التواصل بين الأطباء والباحثين..."}
                required
                className="w-full min-h-[100px] border rounded p-2"
              />
            </div>
            <div className="space-y-[var(--space-2)]">
              <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                الوصف (إنجليزي)
              </label>
              <textarea
                name="heroDescEn"
                defaultValue={initialData?.heroDescEn || "Building bridges between doctors and researchers..."}
                className="w-full min-h-[100px] border rounded p-2 text-left dir-ltr"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-[var(--color-primary)]">قسم عن الجمعية (About)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-[var(--space-2)]">
              <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                نص قسم عن الجمعية (عربي)
              </label>
              <textarea
                name="aboutText"
                defaultValue={initialData?.aboutText || "نؤمن بأن التعليم الطبي المستمر وتبادل الخبرات هما أساس..."}
                required
                className="w-full min-h-[150px] border rounded p-2"
              />
            </div>
            <div className="space-y-[var(--space-2)]">
              <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                نص قسم عن الجمعية (إنجليزي)
              </label>
              <textarea
                name="aboutTextEn"
                defaultValue={initialData?.aboutTextEn || "We believe that continuous medical education and exchanging expertise..."}
                className="w-full min-h-[150px] border rounded p-2 text-left dir-ltr"
              />
            </div>
          </div>
        </div>

        <div>
          <Button type="submit" loading={loading} size="lg">حفظ التغييرات</Button>
        </div>
      </form>
    </div>
  );
}
