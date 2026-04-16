"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  storyId: number;
  chapterId: number;
  title: string;
}

export default function DeleteChapterButton({ storyId, chapterId, title }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/stories/${storyId}/chapters/${chapterId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading}
          className="px-2 py-1 text-[10px] font-bold bg-danger/20 text-danger border border-danger/30 rounded-md hover:bg-danger/30 transition-all disabled:opacity-60">
          {loading ? "..." : "Xóa"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="px-2 py-1 text-[10px] font-medium bg-bg-elevated text-text-muted border border-border-subtle rounded-md hover:text-text-heading transition-all">
          Hủy
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/[0.06] transition-all duration-200"
      title={`Xóa "${title}"`}
    >
      <Trash2 size={13} />
    </button>
  );
}
