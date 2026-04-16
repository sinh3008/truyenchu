import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, List } from "lucide-react";
import DeletePartButton from "@/components/admin/DeletePartButton";

export default async function PartsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.story.findUnique({
    where: { id: parseInt(id) },
    include: {
      parts: {
        orderBy: { part_number: "asc" },
        include: { _count: { select: { chapters: true } } },
      },
    },
  });
  if (!story) notFound();

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link href="/admin/stories" className="hover:text-accent transition-colors">Truyện</Link>
            <span>/</span>
            <span className="text-text-secondary">{story.title}</span>
          </div>
          <h2 className="font-heading text-lg font-bold text-text-heading">Phần & Chương</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/stories/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted border border-border-subtle rounded-lg hover:text-text-heading hover:border-border-light transition-all duration-200"
          >
            <Pencil size={12} /> Sửa Truyện
          </Link>
          <Link
            href={`/admin/stories/${id}/chapters/new`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
          >
            <Plus size={13} /> Thêm Chương
          </Link>
        </div>
      </div>

      {/* Add Part Form */}
      <AddPartForm storyId={parseInt(id)} />

      {/* Parts List */}
      <div className="space-y-3">
        {story.parts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border-subtle rounded-xl">
            <p className="text-sm text-text-muted">Chưa có phần nào. Thêm phần đầu tiên ở trên.</p>
          </div>
        ) : (
          story.parts.map((part) => (
            <div
              key={part.id}
              className="bg-bg-card border border-border-subtle rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-text-muted">{part.part_number}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-heading truncate">{part.title}</p>
                  <p className="text-xs text-text-muted">{part._count.chapters} chương</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/admin/stories/${id}/chapters?part=${part.id}`}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
                  title="Danh sách chương"
                >
                  <List size={14} />
                </Link>
                <DeletePartButton storyId={parseInt(id)} partId={part.id} title={part.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline client component for adding parts
import AddPartForm from "@/components/admin/AddPartForm";
