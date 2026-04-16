import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// GET /api/admin/stories/[id]/chapters
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapters = await prisma.chapter.findMany({
    where: { story_id: parseInt(id) },
    include: { part: { select: { title: true } } },
    orderBy: { chapter_number: 'asc' },
  });
  return NextResponse.json(chapters);
}

// POST /api/admin/stories/[id]/chapters
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { part_id, title, chapter_number, slug, content, is_published } = await request.json();

    if (!title || !part_id) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });

    let num = chapter_number;
    if (!num) {
      const last = await prisma.chapter.findFirst({
        where: { story_id: parseInt(id) },
        orderBy: { chapter_number: 'desc' },
      });
      num = (last?.chapter_number ?? 0) + 1;
    }

    const finalSlug = slug || slugify(title);

    const chapter = await prisma.chapter.create({
      data: {
        story_id: parseInt(id),
        part_id: parseInt(part_id),
        title,
        chapter_number: num,
        slug: finalSlug,
        content: content || '',
        is_published: !!is_published,
      },
    });
    return NextResponse.json(chapter, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Chương đã tồn tại' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
