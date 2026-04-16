import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { plainTextToHtml } from "@/lib/formatContent";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  BookOpen,
} from "lucide-react";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ storySlug: string; chapterSlug: string }>;
}) {
  const { storySlug, chapterSlug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug: storySlug },
  });

  if (!story) notFound();

  const chapter = await prisma.chapter.findUnique({
    where: {
      story_id_slug: {
        story_id: story.id,
        slug: chapterSlug,
      },
    },
    include: { part: true },
  });

  if (!chapter) notFound();

  const prevChapter = await prisma.chapter.findFirst({
    where: {
      story_id: story.id,
      chapter_number: { lt: chapter.chapter_number },
    },
    orderBy: { chapter_number: "desc" },
  });

  const nextChapter = await prisma.chapter.findFirst({
    where: {
      story_id: story.id,
      chapter_number: { gt: chapter.chapter_number },
    },
    orderBy: { chapter_number: "asc" },
  });

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Sticky Reader Nav */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-border-subtle">
        <div className="max-w-[1280px] mx-auto px-4 md:px-5 h-12 flex items-center justify-between gap-4">
          {/* Left: Back */}
          <Link
            href={`/truyen/${story.slug}`}
            className="group flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors duration-200 shrink-0"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            <span className="text-xs font-medium hidden sm:inline truncate max-w-[140px]">
              {story.title}
            </span>
          </Link>

          {/* Center: Chapter Info */}
          <div className="text-center min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-heading truncate">
              {chapter.title}
            </p>
            <p className="text-[10px] text-accent truncate">
              {chapter.part.title}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/"
              className="p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
              title="Trang chủ"
            >
              <Home size={15} />
            </Link>
            <Link
              href={`/truyen/${story.slug}#chapters`}
              className="p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-white/[0.04] transition-all duration-200"
              title="Danh sách chương"
            >
              <List size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto w-full px-5 pt-6">
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors duration-200">
            Trang chủ
          </Link>
          <ChevronRight size={10} className="opacity-40" />
          <Link
            href={`/truyen/${story.slug}`}
            className="hover:text-accent transition-colors duration-200 truncate max-w-[120px] sm:max-w-[200px]"
          >
            {story.title}
          </Link>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-text-secondary truncate max-w-[120px] sm:max-w-[200px]">
            {chapter.title}
          </span>
        </div>
      </div>

      {/* Reading Content */}
      <main className="flex-grow max-w-3xl mx-auto w-full px-5 py-10 md:py-14">
        {/* Chapter Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-2">
            {chapter.part.title}
          </p>
          <h1 className="text-xl md:text-2xl font-heading text-text-heading leading-snug mb-4">
            {chapter.title}
          </h1>
          <div className="w-12 h-[2px] bg-accent/40 mx-auto rounded-full" />
        </div>

        {/* Story Content */}
        <article
          className="story-content"
          dangerouslySetInnerHTML={{ __html: plainTextToHtml(chapter.content) }}
        />

        {/* Chapter Navigation */}
        <div className="mt-14 pt-6 border-t border-border-subtle">
          <div className="flex items-stretch gap-3">
            {/* Previous */}
            {prevChapter ? (
              <Link
                href={`/truyen/${story.slug}/${prevChapter.slug}`}
                className="group flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-bg-card border border-border-subtle hover:border-border-light text-text-secondary hover:text-text-heading transition-all duration-200"
              >
                <ChevronLeft
                  size={15}
                  className="group-hover:-translate-x-0.5 transition-transform duration-200"
                />
                <span className="text-sm font-medium">Chương trước</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {/* Chapter List */}
            <Link
              href={`/truyen/${story.slug}#chapters`}
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-bg-card border border-border-subtle hover:border-border-light text-text-muted hover:text-text-heading transition-all duration-200"
              title="Danh sách chương"
            >
              <BookOpen size={16} />
            </Link>

            {/* Next */}
            {nextChapter ? (
              <Link
                href={`/truyen/${story.slug}/${nextChapter.slug}`}
                className="group flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent-hover transition-all duration-200 shadow-[0_0_16px_rgba(201,168,76,0.15)] hover:shadow-[0_0_24px_rgba(201,168,76,0.3)]"
              >
                <span className="text-sm">Chương sau</span>
                <ChevronRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
            ) : (
              <div className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg bg-bg-card border border-dashed border-border-subtle">
                <span className="text-xs text-text-muted italic">
                  Chương mới nhất
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer for Reading */}
      <div className="border-t border-border-subtle py-4">
        <p className="text-center text-[11px] text-text-muted">
          © {new Date().getFullYear()} NovelVerse — Đọc truyện không giới hạn
        </p>
      </div>
    </div>
  );
}
