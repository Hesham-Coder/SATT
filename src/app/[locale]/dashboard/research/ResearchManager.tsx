"use client";

import { useState } from "react";
import { saveResearch, deleteResearch } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Edit2, Trash2 } from "lucide-react";

type ResType = {
  id: string; title: string; abstract: string; content: string; author: string; publishDate: string; category: string; images: string;
};

export function ResearchManager({ initialData }: { initialData: ResType[] }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentRes, setCurrentRes] = useState<Partial<ResType>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleEdit(res: ResType) {
    setCurrentRes({
      ...res,
      images: JSON.parse(res.images).join(", ")
    });
    setIsEditing(true);
  }

  async function handleDelete(id: string) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      await deleteResearch(id);
    }
  }

  async function handleSubmit(formData: FormData) {
    setErrorMessage("");
    setLoading(true);
    const response = await saveResearch(formData);
    setLoading(false);

    if (response?.error) {
      setErrorMessage(response.error);
      return;
    }

    setIsEditing(false);
    setCurrentRes({});
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">{currentRes.id ? "تعديل البحث" : "إضافة بحث جديد"}</h2>
        <form action={handleSubmit} className="space-y-4">
          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <input type="hidden" name="id" value={currentRes.id || ""} />
          <Input label="العنوان" name="title" defaultValue={currentRes.title || ""} />
          <Input label="الباحث/المؤلف" name="author" defaultValue={currentRes.author || ""} />
          <Input label="تاريخ النشر" name="publishDate" defaultValue={currentRes.publishDate || ""} />
          <Input label="التصنيف" name="category" defaultValue={currentRes.category || ""} />
          
          <div className="space-y-[var(--space-2)]">
            <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
              ملخص البحث
            </label>
            <textarea 
              name="abstract" 
              defaultValue={currentRes.abstract || ""} 
              className="w-full min-h-[60px] border rounded p-2"
            />
          </div>

          <div className="space-y-[var(--space-2)]">
            <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
              المحتوى الكامل
            </label>
            <textarea 
              name="content" 
              defaultValue={currentRes.content || ""} 
              className="w-full min-h-[150px] border rounded p-2"
            />
          </div>

          <Input label="روابط الصور (مفصولة بفاصلة ,)" name="images" defaultValue={currentRes.images || ""} placeholder="/uploads/example.jpg or https://trusted-domain/image.webp" />
          
          <div className="flex gap-4">
            <Button type="submit" loading={loading}>حفظ</Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>الغاء</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">إدارة الأبحاث</h1>
        <Button onClick={() => { setCurrentRes({}); setIsEditing(true); }}>
          <Plus className="mr-2 h-4 w-4" /> إضافة بحث
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">العنوان</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الباحث</th>
              <th className="px-6 py-3 font-semibold text-gray-700">التصنيف</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialData.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 truncate max-w-[200px]">{res.title}</td>
                <td className="px-6 py-4">{res.author}</td>
                <td className="px-6 py-4">{res.category}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button onClick={() => handleEdit(res)} className="text-blue-600 hover:text-blue-800"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(res.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
