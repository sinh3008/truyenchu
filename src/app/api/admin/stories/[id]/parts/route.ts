import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/stories/[id]/parts
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parts = await prisma.storyPart.findMany({
    where: { story_id: parseInt(id) },
    include: { _count: { select: { chapters: true } } },
    orderBy: { part_number: 'asc' },
  });
  return NextResponse.json(parts);
}

// POST /api/admin/stories/[id]/parts
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, part_number, description } = await request.json();
    if (!title) return NextResponse.json({ error: 'Tên phần là bắt buộc' }, { status: 400 });

    // Auto-assign part number if not given
    let num = part_number;
    if (!num) {
      const last = await prisma.storyPart.findFirst({
        where: { story_id: parseInt(id) },
        orderBy: { part_number: 'desc' },
      });
      num = (last?.part_number ?? 0) + 1;
    }

    const part = await prisma.storyPart.create({
      data: { story_id: parseInt(id), title, part_number: num, description },
    });
    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
