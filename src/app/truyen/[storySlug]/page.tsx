import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Layers,
  User,
  Clock,
  ChevronRight,
  Star,
  List,
  ArrowRight,
} from "lucide-react";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ storySlug: string }>;
}) {
  const { storySlug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug: storySlug },
    include: {
      parts: {
        include: {
          chapters: {
            orderBy: { chapter_number: "asc" },
          },
        },
        orderBy: { part_number: "asc" },
      },
    },
  });

  if (!story) notFound();

  const totalChapters = story.parts.reduce(
    (acc, part) => acc + part.chapters.length,
    0
  );

  const firstChapter = story.parts[0]?.chapters[0];

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16 pb-16">
        {/* Banner Background */}
        <div className="relative w-full h-[260px] md:h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-bg-secondary" />
          {story.cover_image && (
            <img
              src={story.cover_image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-[0.08] blur-2xl scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
          {/* Accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-accent/[0.06] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 -mt-[180px] md:-mt-[200px] relative z-10">
          {/* Story Info Card */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Cover */}
            <div className="w-40 md:w-52 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border-light bg-bg-card shadow-lg">
                {story.cover_image ? (
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <BookOpen
                        size={32}
                        className="mx-auto text-text-muted mb-2 opacity-30"
                      />
                      <span className="text-xs text-text-muted font-medium line-clamp-3">
                        {story.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow pt-2 md:pt-8 text-center md:text-left">
              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    story.status === "COMPLETED"
                      ? "bg-success/15 text-success border border-success/20"
                      : "bg-accent-soft text-accent border border-accent/20"
                  }`}
                >
                  {story.status === "ONGOING" ? "Đang ra" : "Hoàn thành"}
                </span>
              </div>

              <h1 className="font-heading text-xl md:text-2xl font-bold text-text-heading leading-tight mb-1.5">
                {story.title}
              </h1>

              {story.alt_title && (
                <p className="text-sm text-text-muted mb-3 italic">
                  {story.alt_title}
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-text-secondary mb-5">
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-accent" />
                  <span>{story.author || "Đang cập nhật"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={13} className="text-accent" />
                  <span>{story.genres || "Đang cập nhật"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-accent" />
                  <span>{totalChapters} Chương</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-accent" />
                  <span>{story.parts.length} Phần</span>
                </div>
              </div>

              {/* Short Description */}
              {story.short_description && (
                <div
                  className="text-sm text-text-secondary leading-relaxed line-clamp-3 max-w-2xl mb-6"
                  dangerouslySetInnerHTML={{
                    __html: story.short_description,
                  }}
                />
              )}

              {/* CTAs */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                {firstChapter ? (
                  <Link
                    href={`/truyen/${story.slug}/${firstChapter.slug}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:shadow-[0_0_28px_rgba(201,168,76,0.3)]"
                  >
                    Đọc Từ Đầu
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-0.5 transition-transform duration-200"
                    />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-5 py-2.5 bg-bg-elevated text-text-muted text-sm font-semibold rounded-lg cursor-not-allowed"
                  >
                    Chưa Có Chương
                  </button>
                )}
                <a
                  href="#chapters"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-secondary border border-border-light rounded-lg hover:border-accent/30 hover:text-text-heading hover:bg-white/[0.02] transition-all duration-200"
                >
                  <List size={15} />
                  Danh sách chương
                </a>
              </div>
            </div>
          </div>

          {/* Content Grid: Description + Chapters */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
                <Star size={15} className="text-accent" />
                <h3 className="text-sm font-semibold text-text-heading uppercase tracking-wider">
                  Giới Thiệu
                </h3>
              </div>
              <div
                className="text-sm text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    story.full_description ||
                    story.short_description ||
                    "Chưa có thông tin.",
                }}
              />
            </div>

            {/* Right: Chapter List */}
            <div id="chapters" className="lg:col-span-2 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
                <List size={15} className="text-accent" />
                <h3 className="text-sm font-semibold text-text-heading uppercase tracking-wider">
                  Danh Sách Chương
                </h3>
              </div>

              <div className="space-y-4">
                {story.parts.map((part) => (
                  <div
                    key={part.id}
                    className="rounded-xl bg-bg-card border border-border-subtle p-5"
                  >
                    <h4 className="text-[0.8125rem] font-semibold text-text-heading mb-1">
                      {part.title}
                    </h4>
                    {part.description && (
                      <p className="text-xs text-text-muted mb-3">
                        {part.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-3">
                      {part.chapters.map((chapter) => (
                        <Link
                          href={`/truyen/${story.slug}/${chapter.slug}`}
                          key={chapter.id}
                          className="group flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-text-secondary hover:text-accent hover:bg-white/[0.03] transition-all duration-200"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors duration-200 shrink-0" />
                          <span className="truncate">{chapter.title}</span>
                          <ChevronRight
                            size={13}
                            className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                          />
                        </Link>
                      ))}
                      {part.chapters.length === 0 && (
                        <span className="text-xs text-text-muted italic py-2 px-3">
                          Phần này chưa có chương nào.
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {story.parts.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-border-subtle rounded-xl">
                    <BookOpen
                      size={24}
                      className="mx-auto text-text-muted mb-3 opacity-30"
                    />
                    <p className="text-sm text-text-muted">
                      Truyện đang được cập nhật nội dung.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
