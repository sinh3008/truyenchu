import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH /api/admin/stories/[id]/parts/[partId]
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; partId: string }> }) {
  try {
    const { partId } = await params;
    const { title, part_number, description } = await request.json();
    const part = await prisma.storyPart.update({
      where: { id: parseInt(partId) },
      data: { title, part_number, description },
    });
    return NextResponse.json(part);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/stories/[id]/parts/[partId]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; partId: string }> }) {
  try {
    const { partId } = await params;
    await prisma.storyPart.delete({ where: { id: parseInt(partId) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
