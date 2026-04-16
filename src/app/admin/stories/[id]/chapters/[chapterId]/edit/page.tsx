import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChapterEditor from "@/components/admin/ChapterEditor";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const [story, chapter] = await Promise.all([
    prisma.story.findUnique({
      where: { id: parseInt(id) },
      include: { parts: { orderBy: { part_number: "asc" } } },
    }),
    prisma.chapter.findUnique({ where: { id: parseInt(chapterId) } }),
  ]);

  if (!story || !chapter) notFound();

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-text-muted mb-1">{story.title} / {chapter.title}</div>
        <h2 className="font-heading text-lg font-bold text-text-heading">Chỉnh Sửa Chương</h2>
      </div>
      <ChapterEditor
        mode="edit"
        storyId={story.id}
        chapterId={chapter.id}
        parts={story.parts}
        initialData={{
          part_id: chapter.part_id,
          title: chapter.title,
          chapter_number: chapter.chapter_number,
          slug: chapter.slug,
          content: chapter.content,
          is_published: chapter.is_published,
        }}
      />
    </div>
  );
}
