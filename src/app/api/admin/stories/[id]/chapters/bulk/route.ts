import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// POST /api/admin/stories/[id]/chapters/bulk
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const storyId = parseInt(id);
    const { chapters, part_id, start_number, is_published } = await request.json();

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: 'Không có dữ liệu chương' }, { status: 400 });
    }
    if (!part_id) {
      return NextResponse.json({ error: 'Thiếu thông tin phần' }, { status: 400 });
    }

    // Get the highest existing chapter number for this story
    const lastChapter = await prisma.chapter.findFirst({
      where: { story_id: storyId },
      orderBy: { chapter_number: 'desc' },
    });

    const baseNumber = start_number ?? (lastChapter?.chapter_number ?? 0) + 1;

    // Build all chapter data
    const created = [];
    for (let i = 0; i < chapters.length; i++) {
      const { title, content } = chapters[i];
      const chapterNumber = baseNumber + i;

      // Generate unique slug
      let slug = slugify(title || `chuong-${chapterNumber}`);
      // Ensure uniqueness by appending story id + chapter number
      slug = `${slug}-${chapterNumber}`;

      const chapter = await prisma.chapter.create({
        data: {
          story_id: storyId,
          part_id: parseInt(part_id),
          title: title || `Chương ${chapterNumber}`,
          chapter_number: chapterNumber,
          slug,
          content: content || '',
          is_published: is_published !== false,
        },
      });
      created.push(chapter);
    }

    return NextResponse.json({ success: true, count: created.length, chapters: created }, { status: 201 });
  } catch (error: any) {
    console.error('Bulk create error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}
