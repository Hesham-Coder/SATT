"use client";

import { saveDoctor } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, Save } from "lucide-react";
import Link from "next/link";

type DoctorData = {
  id?: string;
  name: string;
  nameAr?: string | null;
  nameEn?: string | null;
  role: string;
  roleAr?: string | null;
  roleEn?: string | null;
  focus: string;
  focusAr?: string | null;
  focusEn?: string | null;
  image?: string | null;
  order: number;
};

import { useParams } from "next/navigation";

export function DoctorForm({ initialData }: { initialData?: DoctorData }) {
  const { locale } = useParams();

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{initialData ? "تعديل بيانات العضو" : "إضافة عضو جديد"}</h2>
        <Link href={`/${locale}/dashboard/doctors`}>
          <Button variant="secondary" size="md">
            <ArrowRight size={16} className="ml-2" />
            العودة للقائمة
          </Button>
        </Link>
      </div>


      <form action={saveDoctor} className="space-y-6">
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
        
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="الاسم (عربي)"
            name="nameAr"
            defaultValue={initialData?.nameAr || ""}
            required
          />
          <Input
            label="Name (English)"
            name="nameEn"
            defaultValue={initialData?.nameEn || ""}
            className="text-left dir-ltr"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="الدور الوظيفي (عربي)"
            name="roleAr"
            defaultValue={initialData?.roleAr || ""}
            placeholder="مثلاً: استشاري أورام"
            required
          />
          <Input
            label="Role (English)"
            name="roleEn"
            defaultValue={initialData?.roleEn || ""}
            className="text-left dir-ltr"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="مجال التركيز (عربي)"
            name="focusAr"
            defaultValue={initialData?.focusAr || ""}
            required
          />
          <Input
            label="Focus (English)"
            name="focusEn"
            defaultValue={initialData?.focusEn || ""}
            className="text-left dir-ltr"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="رابط الصورة (Image URL)"
            name="image"
            defaultValue={initialData?.image || ""}
            placeholder="https://..."
          />
          <Input
            label="الترتيب (Order)"
            name="order"
            type="number"
            defaultValue={initialData?.order?.toString() || "0"}
          />
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" className="w-full md:w-auto">
            <Save size={18} className="ml-2" />
            حفظ البيانات
          </Button>
        </div>

      </form>
    </div>
  );
}
