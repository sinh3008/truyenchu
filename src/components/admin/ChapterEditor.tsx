"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

interface Part {
  id: number;
  title: string;
  part_number: number;
}

interface ChapterEditorProps {
  mode: "create" | "edit";
  storyId: number;
  chapterId?: number;
  parts: Part[];
  initialData?: {
    part_id?: number;
    title?: string;
    chapter_number?: number;
    slug?: string;
    content?: string;
    is_published?: boolean;
  };
}

export default function ChapterEditor({
  mode,
  storyId,
  chapterId,
  parts,
  initialData,
}: ChapterEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    part_id: initialData?.part_id?.toString() || parts[0]?.id?.toString() || "",
    title: initialData?.title || "",
    chapter_number: initialData?.chapter_number?.toString() || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    is_published: initialData?.is_published ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(false);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleTitleChange = (value: string) => {
    setForm((p) => ({ ...p, title: value, slug: p.slug || slugify(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? `/api/admin/stories/${storyId}/chapters`
          : `/api/admin/stories/${storyId}/chapters/${chapterId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          part_id: parseInt(form.part_id),
          chapter_number: form.chapter_number ? parseInt(form.chapter_number) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
        return;
      }

      setSuccess(mode === "create" ? "Đã tạo chương thành công!" : "Đã cập nhật!");
      if (mode === "create") {
        setTimeout(() => router.push(`/admin/stories/${storyId}/chapters`), 800);
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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
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

      {/* Meta Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-bg-card border border-border-subtle rounded-xl">
        {/* Part Selector */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Phần <span className="text-danger">*</span>
          </label>
          <select
            value={form.part_id}
            onChange={(e) => setForm((p) => ({ ...p, part_id: e.target.value }))}
            required
            className="w-full px-3 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-all duration-200"
          >
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.title}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter Number */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Số Chương
          </label>
          <input
            type="number"
            value={form.chapter_number}
            onChange={(e) => setForm((p) => ({ ...p, chapter_number: e.target.value }))}
            placeholder="Tự động"
            min={1}
            className="w-full px-3 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all duration-200"
          />
        </div>

        {/* Publish Toggle */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Trạng Thái
          </label>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, is_published: !p.is_published }))}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              form.is_published
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-bg-input text-text-muted border-border-subtle"
            }`}
          >
            {form.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
            {form.is_published ? "Hiển thị" : "Ẩn"}
          </button>
        </div>
      </div>

      {/* Title & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Tiêu Đề Chương <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Chương 1: Trọng Sinh"
            className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="chuong-1-trong-sinh"
            className="w-full px-3.5 py-2.5 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-muted placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200 font-mono"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-text-secondary">
            Nội Dung Chương
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-text-muted border border-border-subtle rounded-md hover:text-text-heading hover:border-border-light transition-all duration-200"
          >
            {preview ? <EyeOff size={11} /> : <Eye size={11} />}
            {preview ? "Ẩn Preview" : "Preview"}
          </button>
        </div>

        <div className={`grid gap-4 ${preview ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Editor */}
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            rows={preview ? 24 : 20}
            placeholder="Nhập nội dung chương tại đây (hỗ trợ HTML cơ bản như <p>, <b>, <i>)..."
            className="w-full px-4 py-4 bg-bg-input border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all duration-200 resize-none font-mono leading-relaxed"
          />
          {/* Preview */}
          {preview && (
            <div
              className="px-6 py-5 bg-bg-card border border-border-subtle rounded-xl overflow-y-auto story-content h-[500px]"
              dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-gray-500 text-sm italic'>Chưa có nội dung...</p>" }}
            />
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {mode === "create" ? "Tạo Chương" : "Lưu Thay Đổi"}
        </button>
        <a
          href={`/admin/stories/${storyId}/chapters`}
          className="px-5 py-2.5 text-sm font-medium text-text-muted border border-border-subtle rounded-lg hover:text-text-heading hover:border-border-light transition-all duration-200"
        >
          Hủy
        </a>
      </div>
    </form>
  );
}
