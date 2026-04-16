import prisma from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Layers, FileText, Plus, ArrowRight, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const [storyCount, partCount, chapterCount, recentStories, recentChapters] =
    await Promise.all([
      prisma.story.count(),
      prisma.storyPart.count(),
      prisma.chapter.count(),
      prisma.story.findMany({ take: 5, orderBy: { created_at: "desc" } }),
      prisma.chapter.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        include: { story: { select: { title: true, slug: true } } },
      }),
    ]);

  const stats = [
    { label: "Tổng Truyện", value: storyCount, icon: BookOpen, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
    { label: "Tổng Phần", value: partCount, icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Tổng Chương", value: chapterCount, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Cập Nhật Gần Đây", value: recentChapters.length, icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <div>
        <h2 className="font-heading text-lg font-bold text-text-heading mb-0.5">
          Tổng Quan
        </h2>
        <p className="text-xs text-text-muted">
          Quản lý toàn bộ nội dung nền tảng NovelVerse
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-xl bg-bg-card border ${stat.border} hover:border-opacity-40 transition-all duration-200 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={15} className={stat.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold font-heading ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/stories/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200"
        >
          <Plus size={13} /> Thêm Truyện
        </Link>
        <Link
          href="/admin/stories"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-bg-card border border-border-subtle text-xs font-medium text-text-secondary rounded-lg hover:text-text-heading hover:border-border-light transition-all duration-200"
        >
          <BookOpen size={13} /> Quản lý Truyện
        </Link>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Stories */}
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-heading">
              Truyện Mới Thêm
            </h3>
            <Link
              href="/admin/stories"
              className="text-[11px] text-text-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentStories.length === 0 && (
              <p className="text-xs text-text-muted py-4 text-center">Chưa có truyện nào.</p>
            )}
            {recentStories.map((story) => (
              <Link
                href={`/admin/stories/${story.id}/edit`}
                key={story.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                    <BookOpen size={11} className="text-accent" />
                  </div>
                  <span className="text-xs font-medium text-text-secondary group-hover:text-text-heading transition-colors truncate">
                    {story.title}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                  story.status === "ONGOING"
                    ? "bg-accent/10 text-accent"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  {story.status === "ONGOING" ? "Đang ra" : "Hoàn thành"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Chapters */}
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-heading">
              Chương Mới Thêm
            </h3>
          </div>
          <div className="space-y-2">
            {recentChapters.length === 0 && (
              <p className="text-xs text-text-muted py-4 text-center">Chưa có chương nào.</p>
            )}
            {recentChapters.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-secondary truncate">
                    {ch.title}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {ch.story.title}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                  ch.is_published
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-white/[0.04] text-text-muted"
                }`}>
                  {ch.is_published ? "Hiển thị" : "Ẩn"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
