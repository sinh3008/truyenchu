import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChapterEditor from "@/components/admin/ChapterEditor";

export default async function NewChapterPage({
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

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs text-text-muted mb-1">{story.title}</div>
        <h2 className="font-heading text-lg font-bold text-text-heading">Thêm Chương Mới</h2>
      </div>
      <ChapterEditor mode="create" storyId={story.id} parts={story.parts} />
    </div>
  );
}
