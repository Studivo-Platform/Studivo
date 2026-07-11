"use client";

import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function ImageUploader({
  images,
  onChange,
}: {
  images: (string | File)[];
  onChange: (images: (string | File)[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const combined = [...images, ...selectedFiles].slice(0, 4);
    onChange(combined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">
          صور المنتج (اختر حتى 4 صور)
        </label>
        <span className="text-[11px] font-semibold text-slate-400">
          {images.length}/4 صور
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => {
          const item = images[i];
          let previewUrl: string | null = null;
          if (item) {
            if (typeof item === "string") {
              previewUrl = item;
            } else if (item instanceof File) {
              previewUrl = URL.createObjectURL(item);
            }
          }

          return (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-slate-100 dark:bg-[#060913] border border-slate-200 dark:border-slate-800 overflow-hidden relative flex items-center justify-center group"
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl shadow-md transition-all cursor-pointer"
                    title="حذف الصورة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 4}
                  className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-indigo-400 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-[10px] font-bold">إضافة صورة</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}