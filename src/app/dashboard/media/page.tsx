"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Trash2 } from "lucide-react";

interface MediaItem {
  filename: string;
  type: "image" | "video";
}

export default function MediaManager() {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media");
        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleDelete = async (filename: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await fetch(`/api/media/${filename}`, { method: "DELETE" });
      if (activeTab === "images") {
        setImages(images.filter((img) => img.filename !== filename));
      } else {
        setVideos(videos.filter((vid) => vid.filename !== filename));
      }
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">المركز الإعلامي</h1>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded">رفع ملف جديد</button>
      </div>

      <div className="flex gap-4 border-b border-[var(--color-border)] mb-6">
        <button
          onClick={() => setActiveTab("images")}
          className={`pb-2 px-1 text-sm font-medium ${activeTab === "images" ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" : "text-gray-500 hover:text-gray-700"}`}
        >
          <ImageIcon className="inline-block mr-2 h-4 w-4" />
          الصور
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`pb-2 px-1 text-sm font-medium ${activeTab === "videos" ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Video className="inline-block mr-2 h-4 w-4" />
          الفيديوهات
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري تحميل الملفات...</div>
      ) : activeTab === "images" ? (
        images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.filename} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/uploads/${img.filename}`} alt={img.filename} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.filename)}
                    className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 border rounded-lg border-dashed">لا توجد صور حالياً</div>
        )
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {videos.map((vid) => (
            <div key={vid.filename} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
              <video className="object-cover w-full h-full" controls>
                <source src={`/uploads/${vid.filename}`} />
              </video>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(vid.filename)}
                  className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border rounded-lg border-dashed">لا توجد فيديوهات حالياً</div>
      )}
    </div>
  );
}
