import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, BookOpen } from "lucide-react";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    include: { _count: { select: { parts: true, chapters: true } } },
    orderBy: { updated_at: "desc" },
  });

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-text-heading">Truyện</h2>
          <p className="text-xs text-text-muted">{stories.length} truyện trong hệ thống</p>
        </div>
        <Link
          href="/admin/stories/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
        >
          <Plus size={13} /> Thêm Truyện
        </Link>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {stories.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen size={28} className="mx-auto text-text-muted mb-3 opacity-30" />
            <p className="text-sm text-text-muted mb-3">Chưa có truyện nào.</p>
            <Link
              href="/admin/stories/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
            >
              <Plus size={13} /> Thêm truyện đầu tiên
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Tên Truyện
                </th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">
                  Tác Giả
                </th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">
                  Phần / Chương
                </th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="text-right py-3 px-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {stories.map((story) => (
                <tr
                  key={story.id}
                  className="hover:bg-white/[0.02] transition-colors duration-150"
                >
                  {/* Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 rounded-md bg-bg-elevated border border-border-subtle overflow-hidden shrink-0 flex items-center justify-center">
                        {story.cover_image ? (
                          <img
                            src={story.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen size={12} className="text-text-muted opacity-40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-heading truncate max-w-[200px]">
                          {story.title}
                        </p>
                        <p className="text-[11px] text-text-muted truncate max-w-[200px]">
                          /{story.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-xs text-text-secondary">
                      {story.author || "—"}
                    </span>
                  </td>

                  {/* Parts / Chapters */}
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-xs text-text-secondary">
                      {story._count.parts} phần · {story._count.chapters} chương
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        story.status === "ONGOING"
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {story.status === "ONGOING" ? "Đang ra" : "Hoàn thành"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/truyen/${story.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
                        title="Xem trên site"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/stories/${story.id}/parts`}
                        className="p-1.5 rounded-md text-text-muted hover:text-blue-400 hover:bg-blue-500/[0.06] transition-all duration-200"
                        title="Quản lý phần & chương"
                      >
                        <BookOpen size={14} />
                      </Link>
                      <Link
                        href={`/admin/stories/${story.id}/edit`}
                        className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/[0.06] transition-all duration-200"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={14} />
                      </Link>
                      <DeleteStoryButton id={story.id} title={story.title} />
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
