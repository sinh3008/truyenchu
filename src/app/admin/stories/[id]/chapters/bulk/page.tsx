import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BulkChapterEditor from "@/components/admin/BulkChapterEditor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function BulkChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.story.findUnique({
    where: { id: parseInt(id) },
    include: { parts: { orderBy: { part_number: "asc" } } },
  });
  if (!story) notFound();

  const lastChapter = await prisma.chapter.findFirst({
    where: { story_id: story.id },
    orderBy: { chapter_number: "desc" },
    select: { chapter_number: true },
  });

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
          <Link
            href="/admin/stories"
            className="hover:text-accent transition-colors"
          >
            Truyện
          </Link>
          <span>/</span>
          <Link
            href={`/admin/stories/${id}/chapters`}
            className="hover:text-accent transition-colors"
          >
            {story.title}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Thêm Hàng Loạt</span>
        </div>
        <h2 className="font-heading text-lg font-bold text-text-heading">
          Thêm Hàng Loạt Chương
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Dán nội dung nhiều chương, hệ thống tự động tách và tạo từng chương
        </p>
      </div>

      <BulkChapterEditor
        storyId={story.id}
        parts={story.parts}
        nextChapterNumber={(lastChapter?.chapter_number ?? 0) + 1}
      />
    </div>
  );
}
