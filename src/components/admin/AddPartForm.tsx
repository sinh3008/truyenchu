"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

export default function AddPartForm({ storyId }: { storyId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/stories/${storyId}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setTitle("");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border-light rounded-xl text-xs font-medium text-text-muted hover:border-accent/30 hover:text-accent transition-all duration-200"
      >
        <Plus size={13} /> Thêm Phần Mới
      </button>
    );
  }

  return (
    <form onSubmit={handleAdd} className="flex items-center gap-2 p-3 bg-bg-card border border-accent/25 rounded-xl">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        placeholder="Tên phần (VD: Phần 1: Khởi Đầu)"
        className="flex-1 px-3 py-2 bg-bg-input border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all duration-200"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
        Thêm
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-3 py-2 text-xs text-text-muted border border-border-subtle rounded-lg hover:text-text-heading transition-all duration-200"
      >
        Hủy
      </button>
    </form>
  );
}
