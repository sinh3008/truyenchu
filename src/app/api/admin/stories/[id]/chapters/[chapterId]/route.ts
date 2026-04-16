import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stories/[id]/chapters/[chapterId]
export async function GET(_: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({ where: { id: parseInt(chapterId) } });
  if (!chapter) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(chapter);
}

// PATCH /api/admin/stories/[id]/chapters/[chapterId]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const { part_id, title, chapter_number, slug, content, is_published } = await request.json();
    const chapter = await prisma.chapter.update({
      where: { id: parseInt(chapterId) },
      data: { part_id: part_id ? parseInt(part_id) : undefined, title, chapter_number, slug, content, is_published },
    });
    return NextResponse.json(chapter);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/stories/[id]/chapters/[chapterId]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    await prisma.chapter.delete({ where: { id: parseInt(chapterId) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
