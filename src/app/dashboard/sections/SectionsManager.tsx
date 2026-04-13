"use client";

import { useState } from "react";
import { saveSettings } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SiteSettingsData = { heroTitle?: string; heroDesc?: string; aboutText?: string; [key: string]: unknown } | null;

export function SectionsManager({ initialData }: { initialData: SiteSettingsData }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await saveSettings(formData);
    setLoading(false);
    alert("تم حفظ الإعدادات بنجاح");
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm max-w-3xl">
      <h2 className="mb-6 text-xl font-bold">محتوى واجهة الموقع</h2>
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary)]">قسم الواجهة (Hero)</h3>
          <Input 
            label="العنوان الرئيسي" 
            name="heroTitle" 
            defaultValue={initialData?.heroTitle || "منظومة متكاملة لخدمة المتخصصين في مجال طب الأورام الحديث."} 
            required 
          />
          <div className="space-y-[var(--space-2)]">
            <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
              الوصف (Description)
            </label>
            <textarea 
              name="heroDesc" 
              defaultValue={initialData?.heroDesc || "نعمل على بناء جسور التواصل بين الأطباء والباحثين..."} 
              required
              className="w-full min-h-[100px] border rounded p-2"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-[var(--color-primary)]">قسم عن الجمعية (About)</h3>
          <div className="space-y-[var(--space-2)]">
            <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
              نص قسم عن الجمعية
            </label>
            <textarea 
              name="aboutText" 
              defaultValue={initialData?.aboutText || "نؤمن بأن التعليم الطبي المستمر وتبادل الخبرات هما أساس..."} 
              required
              className="w-full min-h-[150px] border rounded p-2"
            />
          </div>
        </div>

        <div>
          <Button type="submit" loading={loading} size="lg">حفظ التغييرات</Button>
        </div>
      </form>
    </div>
  );
}
