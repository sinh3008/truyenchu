import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import { Search, Filter, BookOpen } from "lucide-react";

export const revalidate = 60;

export default async function StoryList() {
  const stories = await prisma.story.findMany({
    orderBy: { updated_at: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-5">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-heading text-text-heading tracking-tight mb-2">
              Thư Viện Truyện
            </h1>
            <p className="text-sm text-text-muted">
              Khám phá toàn bộ kho truyện của chúng tôi
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Tìm kiếm truyện..."
                className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all duration-200"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {["Tất cả", "Đang ra", "Hoàn thành"].map((label, i) => (
                <button
                  key={label}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    i === 0
                      ? "bg-accent/10 text-accent border-accent/25"
                      : "bg-bg-card text-text-muted border-border-subtle hover:border-border-light hover:text-text-secondary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          {stories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  slug={story.slug}
                  title={story.title}
                  author={story.author}
                  coverImage={story.cover_image}
                  status={story.status}
                  genres={story.genres}
                  shortDescription={story.short_description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-border-subtle">
              <BookOpen
                size={32}
                className="mx-auto text-text-muted mb-4 opacity-30"
              />
              <p className="text-sm text-text-muted mb-1">
                Chưa có truyện nào trong hệ thống.
              </p>
              <p className="text-xs text-text-muted">
                Hãy thêm truyện qua trang Admin.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
