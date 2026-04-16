import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Eye, Layers } from "lucide-react";
import DeleteChapterButton from "@/components/admin/DeleteChapterButton";

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.story.findUnique({
    where: { id: parseInt(id) },
    include: {
      chapters: {
        include: { part: { select: { title: true } } },
        orderBy: { chapter_number: "asc" },
      },
    },
  });
  if (!story) notFound();

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link href="/admin/stories" className="hover:text-accent transition-colors">Truyện</Link>
            <span>/</span>
            <Link href={`/admin/stories/${id}/parts`} className="hover:text-accent transition-colors">{story.title}</Link>
            <span>/</span>
            <span className="text-text-secondary">Danh Sách Chương</span>
          </div>
          <h2 className="font-heading text-lg font-bold text-text-heading">Danh Sách Chương</h2>
          <p className="text-xs text-text-muted mt-0.5">{story.chapters.length} chương</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/stories/${id}/chapters/bulk`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-bg-card border border-border-subtle text-xs font-semibold text-text-secondary rounded-lg hover:border-border-light hover:text-text-heading transition-all duration-200"
          >
            <Layers size={13} /> Thêm Hàng Loạt
          </Link>
          <Link
            href={`/admin/stories/${id}/chapters/new`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
          >
            <Plus size={13} /> Thêm Chương
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {story.chapters.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-text-muted mb-3">Chưa có chương nào.</p>
            <Link
              href={`/admin/stories/${id}/chapters/new`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all"
            >
              <Plus size={13} /> Thêm Chương Đầu Tiên
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider w-12">#</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Tiêu Đề</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Phần</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Hiển Thị</th>
                <th className="text-right py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {story.chapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-text-muted font-mono">{ch.chapter_number}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <p className="text-sm text-text-heading">{ch.title}</p>
                    <p className="text-[11px] text-text-muted font-mono truncate max-w-[200px]">/{ch.slug}</p>
                  </td>
                  <td className="py-2.5 px-4 hidden md:table-cell">
                    <span className="text-xs text-text-secondary truncate">{ch.part.title}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ch.is_published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/[0.04] text-text-muted border border-border-subtle"
                    }`}>
                      {ch.is_published ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/truyen/${story.slug}/${ch.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
                        title="Xem trên site"
                      >
                        <Eye size={13} />
                      </Link>
                      <Link
                        href={`/admin/stories/${id}/chapters/${ch.id}/edit`}
                        className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/[0.06] transition-all duration-200"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={13} />
                      </Link>
                      <DeleteChapterButton storyId={parseInt(id)} chapterId={ch.id} title={ch.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
