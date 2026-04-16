import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stories/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await prisma.story.findUnique({ where: { id: parseInt(id) } });
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(story);
}

// PATCH /api/admin/stories/[id]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const story = await prisma.story.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        slug: body.slug,
        alt_title: body.alt_title,
        author: body.author,
        short_description: body.short_description,
        full_description: body.full_description,
        cover_image: body.cover_image,
        cover_image_id: body.cover_image_id,
        status: body.status,
        genres: body.genres,
        is_featured: body.is_featured,
      },
    });
    return NextResponse.json(story);
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/stories/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.story.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
