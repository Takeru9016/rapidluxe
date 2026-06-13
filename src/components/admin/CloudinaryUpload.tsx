"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

interface SignedParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

interface Props {
  folder?: string;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export function CloudinaryUpload({
  folder = "rapidluxe",
  onUpload,
  currentUrl,
}: Props) {
  const [activeTab, setActiveTab] = useState<"upload" | "pexels">("upload");
  const [preview, setPreview] = useState<string>(currentUrl ?? "");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      setProgress(0);

      try {
        const res = await fetch("/api/upload/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });
        if (!res.ok) throw new Error("Failed to get upload signature");
        const { data } = (await res.json()) as { data: SignedParams };

        const form = new FormData();
        form.append("file", file);
        form.append("timestamp", String(data.timestamp));
        form.append("signature", data.signature);
        form.append("api_key", data.apiKey);
        form.append("folder", data.folder);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable)
              setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const result = JSON.parse(xhr.responseText) as {
                secure_url: string;
              };
              setPreview(result.secure_url);
              onUpload(result.secure_url);
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
          );
          xhr.send(form);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onUpload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const remove = () => {
    setPreview("");
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-0 border border-(--color-navy-border) rounded-lg overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-1.5 text-xs font-['DM_Sans'] font-medium transition-colors ${
            activeTab === "upload"
              ? "bg-(--color-gold) text-(--color-navy)"
              : "text-(--color-text-secondary) hover:text-white"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pexels")}
          className={`px-4 py-1.5 text-xs font-['DM_Sans'] font-medium transition-colors ${
            activeTab === "pexels"
              ? "bg-(--color-gold) text-(--color-navy)"
              : "text-(--color-text-secondary) hover:text-white"
          }`}
        >
          Search Pexels
        </button>
      </div>

      {activeTab === "upload" ? (
        <>
          {preview ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-(--color-navy-border) group">
              <Image
                src={preview}
                alt="Uploaded preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={remove}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-(--color-coral) transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative w-full h-40 rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 ${
                dragging
                  ? "border-(--color-gold) bg-(--color-gold)/5"
                  : "border-(--color-navy-border) hover:border-(--color-gold)/50 hover:bg-(--color-navy-border)/30"
              }`}
            >
              <ImageIcon size={24} className="text-(--color-text-secondary)" />
              <p className="text-sm font-['DM_Sans'] text-(--color-text-secondary)">
                Drag & drop or{" "}
                <span className="text-(--color-gold) underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                PNG, JPG, WebP — max 10 MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={onFileChange}
              />
            </div>
          )}

          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-['DM_Sans'] text-(--color-text-secondary)">
                <span className="flex items-center gap-1.5">
                  <Upload size={10} />
                  Uploading…
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-(--color-navy-border) rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--color-gold) rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-['DM_Sans'] text-(--color-coral)">
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="w-full h-40 rounded-lg border border-(--color-navy-border) flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-['DM_Sans'] text-(--color-text-secondary)">
            Pexels search — Phase 3A
          </p>
          <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary)/60">
            Stock photo library coming soon
          </p>
        </div>
      )}
    </div>
  );
}
