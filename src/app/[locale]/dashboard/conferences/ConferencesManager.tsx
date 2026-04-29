"use client";

import type { ChangeEvent, DragEvent } from "react";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  IMAGE_URL_VALIDATION_ERROR,
  VIDEO_URL_VALIDATION_ERROR,
  isValidImageUrl,
  isValidVideoUrl,
  normalizeMediaUrl,
} from "@/lib/validateImage";
import { Edit2, Plus, Trash2, Upload, Video, X } from "lucide-react";

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

type PendingMedia = {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

type FieldErrors = Partial<
  Record<
    | "titleAr"
    | "titleEn"
    | "descriptionAr"
    | "descriptionEn"
    | "date"
    | "manualImage"
    | "manualVideo",
    string
  >
>;

const FRONTEND_SYNC_ERROR = "Data not synced with frontend";

function createEmptyConference(): ConferenceFormValues {
  return {
    title: { ar: "", en: "" },
    description: { ar: "", en: "" },
    shortDescription: { ar: "", en: "" },
    date: "",
    location: { ar: "", en: "" },
    category: {
      key: "general",
      label: { ar: "General", en: "General" },
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

function TextareaField({
  id,
  label,
  value,
  onChange,
  rows = 5,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-[var(--space-2)]">
      <label
        className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className="min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-[var(--color-secondary-soft)]"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
      {error ? (
        <p className="text-[length:var(--font-size-xxs)] text-[var(--color-error)]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function formatSize(sizeInBytes: number) {
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.round(sizeInBytes / 1024)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}


export function ConferencesManager({ initialData }: { initialData: Conference[] }) {
  const [conferences, setConferences] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<ConferenceFormValues>(createEmptyConference());
  const [status, setStatus] = useState<StatusState>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [libraryImages, setLibraryImages] = useState<MediaItem[]>([]);
  const [libraryVideos, setLibraryVideos] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [manualVideoUrl, setManualVideoUrl] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const pendingMediaRef = useRef<PendingMedia[]>([]);

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
          setStatus({ kind: "error", message: "Failed to load media library" });
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

  useEffect(() => {
    pendingMediaRef.current = pendingMedia;
  }, [pendingMedia]);

  useEffect(() => {
    return () => {
      pendingMediaRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const sortedConferences = useMemo(
    () => [...conferences].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [conferences],
  );

  function resetEditor() {
    pendingMedia.forEach((item) => URL.revokeObjectURL(item.previewUrl));

    setFormValues(createEmptyConference());
    setFieldErrors({});
    setStatus(null);
    setPendingMedia([]);
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

    if (key === "title") {
      setFieldErrors((current) => ({
        ...current,
        [locale === "ar" ? "titleAr" : "titleEn"]: undefined,
      }));
    }

    if (key === "description") {
      setFieldErrors((current) => ({
        ...current,
        [locale === "ar" ? "descriptionAr" : "descriptionEn"]: undefined,
      }));
    }
  }

  function handleEdit(conference: Conference) {
    setFormValues(mapConferenceToForm(conference));
    setFieldErrors({});
    setPendingMedia([]);
    setIsEditing(true);
    setStatus(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this conference?")) {
      return;
    }

    const response = await fetch(`/api/conferences/${id}`, { method: "DELETE" });

    if (!response.ok) {
      setStatus({ kind: "error", message: "Failed to delete conference" });
      return;
    }

    setConferences((current) => current.filter((conference) => conference.id !== id));
    setStatus({ kind: "success", message: "Conference deleted" });
  }

  function queueMediaFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const allowed = files.filter((file) => file.type.startsWith("image/") || file.type === "video/mp4");

    if (allowed.length !== files.length) {
      setStatus({ kind: "error", message: "Only images and mp4 videos are supported" });
    }

    const additions = allowed.map((file) => ({
      id: `${file.name}-${file.size}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    } satisfies PendingMedia));

    setPendingMedia((current) => [...current, ...additions]);
  }

  function handleUploadInputChange(event: ChangeEvent<HTMLInputElement>) {
    queueMediaFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function onMediaDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    queueMediaFiles(Array.from(event.dataTransfer.files));
  }

  async function uploadMedia(file: File) {
    const requestData = new FormData();
    requestData.append("file", file);

    const response = await fetch("/api/media", {
      method: "POST",
      body: requestData,
    });

    const payload = await response.json().catch(() => ({ error: "Upload failed" }));

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

  async function uploadPendingMedia() {
    if (pendingMedia.length === 0) {
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      for (const item of pendingMedia) {
        await uploadMedia(item.file);
      }

      pendingMedia.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setPendingMedia([]);
      setStatus({ kind: "success", message: "Media uploaded successfully" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Media upload failed",
      });
    } finally {
      setLoading(false);
    }
  }

  function removePendingMedia(id: string) {
    setPendingMedia((current) => {
      const target = current.find((item) => item.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function toggleAsset(listKey: "images" | "videos", value: string) {
    const nextValues = formValues[listKey].includes(value)
      ? formValues[listKey].filter((item) => item !== value)
      : [...formValues[listKey], value];

    updateForm(listKey, nextValues);
  }

  function addManualAsset(listKey: "images" | "videos", value: string) {
    const trimmed = normalizeMediaUrl(value);

    if (!trimmed) {
      return false;
    }

    if (listKey === "images" && !isValidImageUrl(trimmed)) {
      setFieldErrors((current) => ({ ...current, manualImage: "Invalid image URL" }));
      setStatus({ kind: "error", message: IMAGE_URL_VALIDATION_ERROR });
      return false;
    }

    if (listKey === "videos" && !isValidVideoUrl(trimmed)) {
      setFieldErrors((current) => ({ ...current, manualVideo: "Invalid video URL" }));
      setStatus({ kind: "error", message: VIDEO_URL_VALIDATION_ERROR });
      return false;
    }

    updateForm(listKey, Array.from(new Set([...formValues[listKey], trimmed])));
    setStatus(null);
    return true;
  }

  function validateForm(values: ConferenceFormValues) {
    const nextErrors: FieldErrors = {};

    if (!values.title.ar.trim() && !values.title.en.trim()) {
      nextErrors.titleAr = "Title is required";
      nextErrors.titleEn = "Title is required";
    }

    if (!values.description.ar.trim() && !values.description.en.trim()) {
      nextErrors.descriptionAr = "Description is required";
      nextErrors.descriptionEn = "Description is required";
    }

    if (!values.date.trim()) {
      nextErrors.date = "Date is required";
    }

    return nextErrors;
  }

  async function handleSubmit() {
    const nextErrors = validateForm(formValues);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: "error", message: Object.values(nextErrors)[0] ?? "Please complete required fields" });
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

    const payload = await response.json().catch(() => ({ error: "Failed to save conference" }));

    if (!response.ok) {
      setLoading(false);
      setStatus({ kind: "error", message: payload.error || "Failed to save conference" });
      return;
    }

    const savedConference = payload.data as Conference;

    try {
      const syncResponse = await fetch("/api/conferences", { cache: "no-store" });
      const syncPayload = await syncResponse.json();
      const synced = Array.isArray(syncPayload.data)
        && syncPayload.data.some((item: Conference) => item.id === savedConference.id);

      if (!synced) {
        setLoading(false);
        setStatus({ kind: "error", message: FRONTEND_SYNC_ERROR });
        return;
      }
    } catch {
      setLoading(false);
      setStatus({ kind: "error", message: FRONTEND_SYNC_ERROR });
      return;
    }

    setConferences((current) => {
      const withoutCurrent = current.filter((conference) => conference.id !== savedConference.id);
      return [savedConference, ...withoutCurrent];
    });

    setLoading(false);
    resetEditor();
    setStatus({ kind: "success", message: "Conference saved successfully" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conferences Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Production-grade conference form with strict validation and reliable media workflow.
          </p>
        </div>
        <Button
          onClick={() => {
            setStatus(null);
            setFormValues(createEmptyConference());
            setFieldErrors({});
            setIsEditing(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Conference
        </Button>
      </div>

      {status ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {status.message}
        </div>
      ) : null}

      {isEditing ? (
        <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">{formValues.id ? "Edit Conference" : "Create Conference"}</h2>
            <Button onClick={resetEditor} type="button" variant="secondary">
              Cancel
            </Button>
          </div>

          <section className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-semibold text-[var(--color-primary)]">1. Basic Info</h3>
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                id="title-ar"
                label="Title (AR)"
                onChange={(event) => updateLocalizedField("title", "ar", event.target.value)}
                value={formValues.title.ar}
                error={fieldErrors.titleAr}
              />
              <Input
                id="title-en"
                label="Title (EN)"
                onChange={(event) => updateLocalizedField("title", "en", event.target.value)}
                value={formValues.title.en}
                error={fieldErrors.titleEn}
              />
              <Input
                id="location-ar"
                label="Location (AR)"
                onChange={(event) => updateLocalizedField("location", "ar", event.target.value)}
                value={formValues.location.ar}
              />
              <Input
                id="location-en"
                label="Location (EN)"
                onChange={(event) => updateLocalizedField("location", "en", event.target.value)}
                value={formValues.location.en}
              />
              <Input
                id="category-ar"
                label="Category (AR)"
                onChange={(event) =>
                  updateForm("category", {
                    ...formValues.category,
                    label: { ...formValues.category.label, ar: event.target.value },
                  })
                }
                value={formValues.category.label.ar}
              />
              <Input
                id="category-en"
                label="Category (EN)"
                onChange={(event) =>
                  updateForm("category", {
                    ...formValues.category,
                    label: { ...formValues.category.label, en: event.target.value },
                  })
                }
                value={formValues.category.label.en}
              />
              <Input
                id="tags-ar"
                label="Tags (AR)"
                onChange={(event) =>
                  updateForm("tags", {
                    ...formValues.tags,
                    ar: splitCommaValues(event.target.value),
                  })
                }
                placeholder="targeted therapy, oncology"
                value={formValues.tags.ar.join(", ")}
              />
              <Input
                id="tags-en"
                label="Tags (EN)"
                onChange={(event) =>
                  updateForm("tags", {
                    ...formValues.tags,
                    en: splitCommaValues(event.target.value),
                  })
                }
                placeholder="oncology, summit"
                value={formValues.tags.en.join(", ")}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-semibold text-[var(--color-primary)]">2. Content</h3>
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                id="short-description-ar"
                label="Short Description (AR)"
                onChange={(event) => updateLocalizedField("shortDescription", "ar", event.target.value)}
                value={formValues.shortDescription.ar}
              />
              <Input
                id="short-description-en"
                label="Short Description (EN)"
                onChange={(event) => updateLocalizedField("shortDescription", "en", event.target.value)}
                value={formValues.shortDescription.en}
              />
              <TextareaField
                id="description-ar"
                label="Full Description (AR)"
                onChange={(value) => updateLocalizedField("description", "ar", value)}
                value={formValues.description.ar}
                error={fieldErrors.descriptionAr}
              />
              <TextareaField
                id="description-en"
                label="Full Description (EN)"
                onChange={(value) => updateLocalizedField("description", "en", value)}
                value={formValues.description.en}
                error={fieldErrors.descriptionEn}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-semibold text-[var(--color-primary)]">3. Event Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="conference-date"
                label="Date"
                onChange={(event) => {
                  updateForm("date", event.target.value);
                  setFieldErrors((current) => ({ ...current, date: undefined }));
                }}
                type="date"
                value={formValues.date}
                error={fieldErrors.date}
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
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-semibold text-[var(--color-primary)]">4. Media</h3>

            <div className="space-y-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
              <h4 className="font-semibold">A. Upload Media</h4>
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center transition ${isDragActive ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "border-[var(--color-border)] bg-white"}`}
                onDrop={onMediaDrop}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    uploadInputRef.current?.click();
                  }
                }}
              >
                <p className="text-sm text-[var(--color-text-secondary)]">Drag and drop images/videos here</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Supported: image/* and mp4</p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Select files
                </Button>
                <input
                  ref={uploadInputRef}
                  data-testid="media-upload-input"
                  accept="image/*,video/mp4"
                  className="hidden"
                  multiple
                  onChange={handleUploadInputChange}
                  type="file"
                />
              </div>

              {pendingMedia.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {pendingMedia.map((item) => (
                      <div key={item.id} className="overflow-hidden rounded-lg border bg-white p-2">
                        <div className="relative aspect-video overflow-hidden rounded-md bg-black/5">
                          {item.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt={item.file.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              src={item.previewUrl}
                              onError={(event) => {
                                event.currentTarget.src = "/images/conference-1.png";
                              }}
                            />
                          ) : (
                            <video className="h-full w-full object-cover" controls preload="metadata">
                              <source src={item.previewUrl} type="video/mp4" />
                            </video>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium">{item.file.name}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{formatSize(item.file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePendingMedia(item.id)}
                            aria-label="Remove pending media"
                            className="rounded p-1 text-gray-500 hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" loading={loading} onClick={uploadPendingMedia}>
                    Upload selected media
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">B. External Links - Image</h4>
                <Input
                  id="manual-image-url"
                  label="Image URL"
                  onChange={(event) => {
                    setManualImageUrl(event.target.value);
                    setFieldErrors((current) => ({ ...current, manualImage: undefined }));
                  }}
                  placeholder="/uploads/image.jpg or https://trusted/image.webp"
                  value={manualImageUrl}
                  error={fieldErrors.manualImage}
                />
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
                  Add image URL
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">B. External Links - Video</h4>
                <Input
                  id="manual-video-url"
                  label="Video URL"
                  onChange={(event) => {
                    setManualVideoUrl(event.target.value);
                    setFieldErrors((current) => ({ ...current, manualVideo: undefined }));
                  }}
                  placeholder="https://youtube.com/... or /uploads/video.mp4"
                  value={manualVideoUrl}
                  error={fieldErrors.manualVideo}
                />
                <Button
                  onClick={() => {
                    const added = addManualAsset("videos", manualVideoUrl);

                    if (added) {
                      setManualVideoUrl("");
                    }
                  }}
                  type="button"
                  variant="secondary"
                >
                  <Video className="h-4 w-4" /> Add video URL
                </Button>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-primary)]">Image Library</h3>
                <span className="text-xs text-gray-500">{formValues.images.length} selected</span>
              </div>
              {mediaLoading ? (
                <p className="text-sm text-gray-500">Loading media...</p>
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
                        <img
                          alt={item.filename}
                          className="aspect-video h-full w-full object-cover"
                          loading="lazy"
                          src={item.url}
                          onError={(event) => {
                            event.currentTarget.src = "/images/conference-1.png";
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-primary)]">Video Library</h3>
                <span className="text-xs text-gray-500">{formValues.videos.length} selected</span>
              </div>
              {mediaLoading ? (
                <p className="text-sm text-gray-500">Loading media...</p>
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
            <Button data-testid="save-conference" loading={loading} onClick={handleSubmit} type="button">
              Save conference
            </Button>
            <Button onClick={resetEditor} type="button" variant="secondary">
              Close editor
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 font-semibold text-gray-700">Media</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
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
                  No conferences yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
