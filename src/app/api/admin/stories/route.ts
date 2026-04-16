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

// GET /api/admin/stories
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: { _count: { select: { parts: true, chapters: true } } },
      orderBy: { updated_at: 'desc' },
    });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/stories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, alt_title, author, short_description, full_description, cover_image, cover_image_id, status, genres, is_featured } = body;

    if (!title) return NextResponse.json({ error: 'Tên truyện là bắt buộc' }, { status: 400 });

    const finalSlug = slug || slugify(title);

    const story = await prisma.story.create({
      data: { title, slug: finalSlug, alt_title, author, short_description, full_description, cover_image, cover_image_id, status: status || 'ONGOING', genres, is_featured: !!is_featured },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
