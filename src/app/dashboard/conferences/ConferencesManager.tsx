"use client";

import type { ChangeEvent } from "react";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IMAGE_URL_VALIDATION_ERROR, isValidImageUrl } from "@/lib/validateImage";
import { Edit2, Plus, Trash2, Upload, Video } from "lucide-react";

import type { Conference, ConferenceFormValues } from "@/types/conference";

type MediaItem = {
  filename: string;
  url: string;
  type: "image" | "video";
  size: number;
  updatedAt: string;
};

type StatusState = {
  kind: "error" | "success";
  message: string;
} | null;

function createEmptyConference(): ConferenceFormValues {
  return {
    title: { ar: "", en: "" },
    description: { ar: "", en: "" },
    shortDescription: { ar: "", en: "" },
    date: "",
    location: { ar: "", en: "" },
    category: {
      key: "general",
      label: { ar: "عام", en: "General" },
    },
    images: [],
    videos: [],
    tags: { ar: [], en: [] },
  };
}

function mapConferenceToForm(conference: Conference): ConferenceFormValues {
  return {
    id: conference.id,
    title: conference.title,
    description: conference.description,
    shortDescription: conference.shortDescription,
    date: conference.date,
    location: conference.location,
    category: conference.category,
    images: conference.images,
    videos: conference.videos,
    tags: conference.tags,
  };
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-[var(--space-2)]">
      <label className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
        {label}
      </label>
      <textarea
        className="min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-[var(--color-secondary-soft)]"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </div>
  );
}

function splitCommaValues(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function ConferencesManager({ initialData }: { initialData: Conference[] }) {
  const [conferences, setConferences] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<ConferenceFormValues>(createEmptyConference());
  const [status, setStatus] = useState<StatusState>(null);
  const [loading, setLoading] = useState(false);
  const [libraryImages, setLibraryImages] = useState<MediaItem[]>([]);
  const [libraryVideos, setLibraryVideos] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [manualVideoUrl, setManualVideoUrl] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMedia() {
      try {
        const response = await fetch("/api/media", { cache: "no-store" });
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setLibraryImages(data.images || []);
        setLibraryVideos(data.videos || []);
      } catch {
        if (isMounted) {
          setStatus({ kind: "error", message: "تعذر تحميل مكتبة الوسائط." });
        }
      } finally {
        if (isMounted) {
          setMediaLoading(false);
        }
      }
    }

    void loadMedia();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedConferences = useMemo(
    () => [...conferences].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [conferences],
  );

  function resetEditor() {
    setFormValues(createEmptyConference());
    setIsEditing(false);
    setManualVideoUrl("");
    setManualImageUrl("");
  }

  function updateForm<K extends keyof ConferenceFormValues>(key: K, value: ConferenceFormValues[K]) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  function updateLocalizedField(
    key: "title" | "description" | "shortDescription" | "location",
    locale: "ar" | "en",
    value: string,
  ) {
    setFormValues((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [locale]: value,
      },
    }));
  }

  function handleEdit(conference: Conference) {
    setFormValues(mapConferenceToForm(conference));
    setIsEditing(true);
    setStatus(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف المؤتمر؟")) {
      return;
    }

    const response = await fetch(`/api/conferences/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setStatus({ kind: "error", message: "فشل حذف المؤتمر." });
      return;
    }

    setConferences((current) => current.filter((conference) => conference.id !== id));
    setStatus({ kind: "success", message: "تم حذف المؤتمر بنجاح." });
  }

  async function uploadMedia(file: File) {
    const requestData = new FormData();
    requestData.append("file", file);

    const response = await fetch("/api/media", {
      method: "POST",
      body: requestData,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Upload failed");
    }

    if (payload.type === "image") {
      setLibraryImages((current) => [payload, ...current.filter((item) => item.filename !== payload.filename)]);
      setFormValues((current) => ({
        ...current,
        images: Array.from(new Set([payload.url, ...current.images])),
      }));
    } else {
      setLibraryVideos((current) => [payload, ...current.filter((item) => item.filename !== payload.filename)]);
      setFormValues((current) => ({
        ...current,
        videos: Array.from(new Set([payload.url, ...current.videos])),
      }));
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      for (const file of files) {
        await uploadMedia(file);
      }

      setStatus({ kind: "success", message: "تم رفع الوسائط وإضافتها إلى المؤتمر." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "فشل رفع الملف.",
      });
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  function toggleAsset(listKey: "images" | "videos", value: string) {
    const nextValues = formValues[listKey].includes(value)
      ? formValues[listKey].filter((item) => item !== value)
      : [...formValues[listKey], value];

    updateForm(listKey, nextValues);
  }

  function addManualAsset(listKey: "images" | "videos", value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      return false;
    }

    if (listKey === "images" && !isValidImageUrl(trimmed)) {
      setStatus({ kind: "error", message: IMAGE_URL_VALIDATION_ERROR });
      return false;
    }

    updateForm(listKey, Array.from(new Set([...formValues[listKey], trimmed])));
    return true;
  }

  async function handleSubmit() {
    if (!formValues.title.ar.trim() || !formValues.title.en.trim()) {
      setStatus({ kind: "error", message: "يجب إدخال عنوان المؤتمر بالعربية والإنجليزية." });
      return;
    }

    if (!formValues.date.trim()) {
      setStatus({ kind: "error", message: "يرجى تحديد تاريخ المؤتمر." });
      return;
    }

    if (formValues.images.some((imageUrl) => !isValidImageUrl(imageUrl))) {
      setStatus({ kind: "error", message: IMAGE_URL_VALIDATION_ERROR });
      return;
    }

    setLoading(true);
    setStatus(null);

    const response = await fetch(
      formValues.id ? `/api/conferences/${formValues.id}` : "/api/conferences",
      {
        method: formValues.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          category: {
            ...formValues.category,
            key:
              formValues.category.key ||
              formValues.category.label.en.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
              "general",
          },
        }),
      },
    );

    const payload = await response.json();

    setLoading(false);

    if (!response.ok) {
      setStatus({ kind: "error", message: payload.error || "فشل حفظ المؤتمر." });
      return;
    }

    const savedConference = payload.data as Conference;

    setConferences((current) => {
      const withoutCurrent = current.filter((conference) => conference.id !== savedConference.id);
      return [savedConference, ...withoutCurrent];
    });

    setStatus({ kind: "success", message: "تم حفظ المؤتمر بنجاح." });
    resetEditor();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المؤتمرات والفعاليات</h1>
          <p className="mt-2 text-sm text-gray-500">
            إدارة متعددة اللغات للصور والفيديو والمحتوى والتصنيفات الخاصة بالمؤتمرات.
          </p>
        </div>
        <Button
          onClick={() => {
            setStatus(null);
            setFormValues(createEmptyConference());
            setIsEditing(true);
          }}
        >
          <Plus className="h-4 w-4" /> إضافة مؤتمر
        </Button>
      </div>

      {status ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      {isEditing ? (
        <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">{formValues.id ? "تعديل المؤتمر" : "إضافة مؤتمر جديد"}</h2>
            <Button onClick={resetEditor} type="button" variant="secondary">
              إلغاء
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="font-semibold text-[var(--color-primary)]">المحتوى العربي</h3>
              <Input
                id="title-ar"
                label="العنوان"
                onChange={(event) => updateLocalizedField("title", "ar", event.target.value)}
                value={formValues.title.ar}
              />
              <Input
                id="location-ar"
                label="الموقع"
                onChange={(event) => updateLocalizedField("location", "ar", event.target.value)}
                value={formValues.location.ar}
              />
              <Input
                id="category-ar"
                label="التصنيف"
                onChange={(event) =>
                  updateForm("category", {
                    ...formValues.category,
                    label: { ...formValues.category.label, ar: event.target.value },
                  })
                }
                value={formValues.category.label.ar}
              />
              <Input
                id="tags-ar"
                label="الوسوم العربية"
                onChange={(event) =>
                  updateForm("tags", {
                    ...formValues.tags,
                    ar: splitCommaValues(event.target.value),
                  })
                }
                placeholder="مثال: علاج موجه, أورام"
                value={formValues.tags.ar.join(", ")}
              />
              <Input
                id="short-description-ar"
                label="الوصف المختصر"
                onChange={(event) => updateLocalizedField("shortDescription", "ar", event.target.value)}
                value={formValues.shortDescription.ar}
              />
              <TextareaField
                label="الوصف الكامل"
                onChange={(value) => updateLocalizedField("description", "ar", value)}
                value={formValues.description.ar}
              />
            </div>

            <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="font-semibold text-[var(--color-primary)]">English Content</h3>
              <Input
                id="title-en"
                label="Title"
                onChange={(event) => updateLocalizedField("title", "en", event.target.value)}
                value={formValues.title.en}
              />
              <Input
                id="location-en"
                label="Location"
                onChange={(event) => updateLocalizedField("location", "en", event.target.value)}
                value={formValues.location.en}
              />
              <Input
                id="category-en"
                label="Category"
                onChange={(event) =>
                  updateForm("category", {
                    ...formValues.category,
                    label: { ...formValues.category.label, en: event.target.value },
                    key: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || formValues.category.key,
                  })
                }
                value={formValues.category.label.en}
              />
              <Input
                id="category-key"
                label="Category Key"
                onChange={(event) =>
                  updateForm("category", {
                    ...formValues.category,
                    key: event.target.value,
                  })
                }
                value={formValues.category.key}
              />
              <Input
                id="tags-en"
                label="English Tags"
                onChange={(event) =>
                  updateForm("tags", {
                    ...formValues.tags,
                    en: splitCommaValues(event.target.value),
                  })
                }
                placeholder="Example: oncology, summit"
                value={formValues.tags.en.join(", ")}
              />
              <Input
                id="short-description-en"
                label="Short Description"
                onChange={(event) => updateLocalizedField("shortDescription", "en", event.target.value)}
                value={formValues.shortDescription.en}
              />
              <TextareaField
                label="Full Description"
                onChange={(value) => updateLocalizedField("description", "en", value)}
                value={formValues.description.en}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-4 font-semibold text-[var(--color-primary)]">إعدادات الحدث</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="conference-date"
                  label="التاريخ"
                  onChange={(event) => updateForm("date", event.target.value)}
                  type="date"
                  value={formValues.date}
                />
                <Input
                  id="manual-image-url"
                  label="إضافة رابط صورة"
                  onChange={(event) => setManualImageUrl(event.target.value)}
                  placeholder="https://..."
                  value={manualImageUrl}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]">
                  <Upload className="h-4 w-4" />
                  رفع صور أو فيديوهات
                  <input
                    accept="image/*,video/*"
                    className="hidden"
                    multiple
                    onChange={handleMediaUpload}
                    type="file"
                  />
                </label>
                <Button
                  onClick={() => {
                    const added = addManualAsset("images", manualImageUrl);

                    if (added) {
                      setManualImageUrl("");
                    }
                  }}
                  type="button"
                  variant="secondary"
                >
                  إضافة رابط الصورة
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-4 font-semibold text-[var(--color-primary)]">الفيديوهات</h3>
              <Input
                id="manual-video-url"
                label="رابط فيديو أو يوتيوب"
                onChange={(event) => setManualVideoUrl(event.target.value)}
                placeholder="https://youtube.com/... أو /uploads/..."
                value={manualVideoUrl}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    addManualAsset("videos", manualVideoUrl);
                    setManualVideoUrl("");
                  }}
                  type="button"
                  variant="secondary"
                >
                  <Video className="h-4 w-4" /> إضافة الفيديو
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-primary)]">مكتبة الصور</h3>
                <span className="text-xs text-gray-500">{formValues.images.length} محددة</span>
              </div>
              {mediaLoading ? (
                <p className="text-sm text-gray-500">جاري تحميل الوسائط...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {libraryImages.map((item) => {
                    const active = formValues.images.includes(item.url);
                    return (
                      <button
                        className={`relative overflow-hidden rounded-lg border ${active ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary-soft)]" : "border-[var(--color-border)]"}`}
                        key={item.filename}
                        onClick={() => toggleAsset("images", item.url)}
                        type="button"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={item.filename} className="aspect-video h-full w-full object-cover" src={item.url} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-primary)]">مكتبة الفيديو</h3>
                <span className="text-xs text-gray-500">{formValues.videos.length} محددة</span>
              </div>
              {mediaLoading ? (
                <p className="text-sm text-gray-500">جاري تحميل الوسائط...</p>
              ) : (
                <div className="space-y-3">
                  {libraryVideos.map((item) => {
                    const active = formValues.videos.includes(item.url);
                    return (
                      <button
                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-right text-sm ${active ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}
                        key={item.filename}
                        onClick={() => toggleAsset("videos", item.url)}
                        type="button"
                      >
                        <span>{item.filename}</span>
                        <span>{Math.round(item.size / 1024)} KB</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button loading={loading} onClick={handleSubmit} type="button">
              حفظ المؤتمر
            </Button>
            <Button onClick={resetEditor} type="button" variant="secondary">
              إغلاق المحرر
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">العنوان</th>
              <th className="px-6 py-3 font-semibold text-gray-700">التاريخ</th>
              <th className="px-6 py-3 font-semibold text-gray-700">التصنيف</th>
              <th className="px-6 py-3 font-semibold text-gray-700">الصور / الفيديو</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedConferences.map((conference) => (
              <tr className="hover:bg-gray-50" key={conference.id}>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--color-text-primary)]">{conference.title.ar}</p>
                    <p className="text-xs text-gray-500">{conference.title.en}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{conference.date}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p>{conference.category.label.ar}</p>
                    <p className="text-xs text-gray-500">{conference.category.label.en}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{conference.images.length} / {conference.videos.length}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(conference)} type="button">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(conference.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedConferences.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                  لا توجد مؤتمرات مضافة حتى الآن.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
