import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import StoryForm from "@/components/admin/StoryForm";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await prisma.story.findUnique({ where: { id: parseInt(id) } });
  if (!story) notFound();

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-heading text-lg font-bold text-text-heading">Chỉnh Sửa Truyện</h2>
        <p className="text-xs text-text-muted mt-0.5">{story.title}</p>
      </div>
      <StoryForm
        mode="edit"
        storyId={story.id}
        initialData={{
          title: story.title,
          slug: story.slug,
          alt_title: story.alt_title || "",
          author: story.author || "",
          short_description: story.short_description || "",
          full_description: story.full_description || "",
          cover_image: story.cover_image || "",
          cover_image_id: story.cover_image_id || "",
          status: story.status,
          genres: story.genres || "",
          is_featured: story.is_featured,
        }}
      />
    </div>
  );
}
