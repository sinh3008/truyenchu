"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface StoryFormProps {
  mode: "create" | "edit";
  storyId?: number;
  initialData?: {
    title?: string;
    slug?: string;
    alt_title?: string;
    author?: string;
    short_description?: string;
    full_description?: string;
    cover_image?: string;
    cover_image_id?: string;
    status?: string;
    genres?: string;
    is_featured?: boolean;
  };
}

export default function StoryForm({
  mode,
  storyId,
  initialData,
}: StoryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    alt_title: initialData?.alt_title || "",
    author: initialData?.author || "",
    short_description: initialData?.short_description || "",
    full_description: initialData?.full_description || "",
    cover_image: initialData?.cover_image || "",
    cover_image_id: initialData?.cover_image_id || "",
    status: initialData?.status || "ONGOING",
    genres: initialData?.genres || "",
    is_featured: initialData?.is_featured || false,
  });

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || slugify(value),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh");
      return;
    }
    setUploadLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            publicId: form.cover_image_id || undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setForm((prev) => ({
            ...prev,
            cover_image: data.url,
            cover_image_id: data.publicId,
          }));
        } else {
          setError(data.error || "Upload thất bại");
        }
        setUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Upload thất bại");
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/stories"
          : `/api/admin/stories/${storyId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        return;
      }

      setSuccess(mode === "create" ? "Đã tạo truyện thành công!" : "Đã cập nhật!");
      if (mode === "create") {
        setTimeout(() => router.push(`/admin/stories/${data.id}/parts`), 1000);
      } else {
        router.refresh();
      }
    } catch {
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
          <AlertCircle size={14} className="text-danger shrink-0" />
          <span className="text-xs text-danger">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-400">{success}</span>
        </div>
      )}

      {/* Grid: Left Form + Right Cover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Main Fields */}
        <div className="md:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Tên Truyện <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Nhập tên truyện..."
              className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Slug (URL)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="ten-truyen-ma-hoc"
              className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-muted placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200 font-mono"
            />
          </div>

          {/* Alternate title + Author */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Tên Khác
              </label>
              <input
                type="text"
                value={form.alt_title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, alt_title: e.target.value }))
                }
                placeholder="Tên khác (nếu có)"
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Tác Giả
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) =>
                  setForm((p) => ({ ...p, author: e.target.value }))
                }
                placeholder="Tên tác giả"
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
              />
            </div>
          </div>

          {/* Genres + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Thể Loại
              </label>
              <input
                type="text"
                value={form.genres}
                onChange={(e) =>
                  setForm((p) => ({ ...p, genres: e.target.value }))
                }
                placeholder="Tiên Hiệp, Huyền Huyễn"
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Trạng Thái
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
              >
                <option value="ONGOING">Đang ra</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Mô Tả Ngắn
            </label>
            <textarea
              value={form.short_description}
              onChange={(e) =>
                setForm((p) => ({ ...p, short_description: e.target.value }))
              }
              rows={2}
              placeholder="Tóm tắt ngắn gọn (hiển thị trên card truyện)..."
              className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200 resize-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Mô Tả Đầy Đủ
            </label>
            <textarea
              value={form.full_description}
              onChange={(e) =>
                setForm((p) => ({ ...p, full_description: e.target.value }))
              }
              rows={5}
              placeholder="Mô tả chi tiết về truyện (hỗ trợ HTML cơ bản)..."
              className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200 resize-none"
            />
          </div>

          {/* Is Featured */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_featured: e.target.checked }))
                }
                className="sr-only"
              />
              <div
                className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                  form.is_featured ? "bg-accent" : "bg-bg-elevated border border-border-light"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${
                    form.is_featured ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-heading transition-colors">
              Đánh dấu là truyện nổi bật
            </span>
          </label>
        </div>

        {/* Right: Cover Upload */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Ảnh Bìa
          </label>
          <div
            className="relative aspect-[2/3] rounded-xl border-2 border-dashed border-border-light bg-bg-input flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent/40 transition-colors duration-200 group"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleImageUpload(file);
              };
              input.click();
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleImageUpload(file);
            }}
          >
            {uploadLoading ? (
              <div className="text-center">
                <Loader2 size={20} className="text-accent mx-auto mb-1 animate-spin" />
                <p className="text-[10px] text-text-muted">Đang upload...</p>
              </div>
            ) : form.cover_image ? (
              <>
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={20} className="text-white" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((p) => ({ ...p, cover_image: "", cover_image_id: "" }));
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-danger/80 transition-colors z-10"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <Upload size={20} className="text-text-muted mx-auto mb-2 group-hover:text-accent transition-colors" />
                <p className="text-[11px] text-text-muted">
                  Kéo thả hoặc click để chọn ảnh
                </p>
                <p className="text-[10px] text-text-muted mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
          </div>
          {form.cover_image && (
            <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
              <CheckCircle2 size={10} /> Đã upload thành công
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
          )}
          {mode === "create" ? "Tạo Truyện" : "Lưu Thay Đổi"}
        </button>
        <a
          href="/admin/stories"
          className="px-5 py-2.5 text-sm font-medium text-text-muted border border-border-subtle rounded-lg hover:text-text-heading hover:border-border-light transition-all duration-200"
        >
          Hủy
        </a>
      </div>
    </form>
  );
}
