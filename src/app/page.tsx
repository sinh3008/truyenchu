import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import StoryCard from "@/components/StoryCard";
import SectionHeader from "@/components/SectionHeader";
import { TrendingUp, Clock, Star } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const featuredStories = await prisma.story.findMany({
    where: { is_featured: true },
    take: 10,
    orderBy: { updated_at: "desc" },
  });

  const latestStories = await prisma.story.findMany({
    take: 10,
    orderBy: { created_at: "desc" },
  });

  const allStories = await prisma.story.findMany({
    take: 10,
    orderBy: { updated_at: "desc" },
  });

  const genres = [
    { name: "Tiên Hiệp", icon: "⚔️", count: 0 },
    { name: "Huyền Huyễn", icon: "✨", count: 0 },
    { name: "Kiếm Hiệp", icon: "🗡️", count: 0 },
    { name: "Khoa Huyễn", icon: "🚀", count: 0 },
    { name: "Ngôn Tình", icon: "💕", count: 0 },
    { name: "Đô Thị", icon: "🏙️", count: 0 },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <Hero />

        {/* Divider */}
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />
        </div>

        {/* Featured Stories */}
        <section className="max-w-[1280px] mx-auto px-5 py-12">
          <SectionHeader
            title="Truyện Nổi Bật"
            subtitle="Được chọn lọc bởi đội ngũ biên tập"
            viewAllHref="/truyen"
          />
          {featuredStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredStories.map((story) => (
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
            <div className="text-center py-16 rounded-xl border border-dashed border-border-subtle">
              <Star size={24} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-sm text-text-muted">Chưa có truyện nổi bật nào.</p>
            </div>
          )}
        </section>

        {/* Latest Updates */}
        <section className="max-w-[1280px] mx-auto px-5 py-12">
          <SectionHeader
            title="Mới Cập Nhật"
            subtitle="Các truyện có chương mới nhất"
            viewAllHref="/truyen?sort=latest"
          />
          {latestStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {latestStories.map((story) => (
                <StoryCard
                  key={story.id}
                  slug={story.slug}
                  title={story.title}
                  author={story.author}
                  coverImage={story.cover_image}
                  status={story.status}
                  genres={story.genres}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl border border-dashed border-border-subtle">
              <Clock size={24} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-sm text-text-muted">Chưa có truyện nào.</p>
            </div>
          )}
        </section>

        {/* Popular Genres */}
        <section className="max-w-[1280px] mx-auto px-5 py-12">
          <SectionHeader title="Thể Loại Phổ Biến" subtitle="Khám phá theo sở thích của bạn" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {genres.map((genre) => (
              <a
                key={genre.name}
                href={`/truyen?genre=${encodeURIComponent(genre.name)}`}
                className="group flex flex-col items-center gap-2.5 p-5 rounded-xl bg-bg-card border border-border-subtle hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-250 hover:-translate-y-0.5"
              >
                <span className="text-2xl">{genre.icon}</span>
                <span className="text-xs font-semibold text-text-secondary group-hover:text-accent transition-colors duration-200">
                  {genre.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Trending / All Stories */}
        <section className="max-w-[1280px] mx-auto px-5 py-12">
          <SectionHeader
            title="Xu Hướng"
            subtitle="Truyện được đọc nhiều nhất"
            viewAllHref="/truyen?sort=popular"
          />
          {allStories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allStories.map((story) => (
                <StoryCard
                  key={story.id}
                  slug={story.slug}
                  title={story.title}
                  author={story.author}
                  coverImage={story.cover_image}
                  status={story.status}
                  genres={story.genres}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl border border-dashed border-border-subtle">
              <TrendingUp size={24} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-sm text-text-muted">Chưa có dữ liệu.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
