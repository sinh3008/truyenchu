import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // Check if admin already exists
    const adminCount = await prisma.admin.count();
    
    if (adminCount === 0) {
      const password_hash = await bcrypt.hash('admin', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password_hash,
        }
      });
    }

    // Seed story
    const storyCount = await prisma.story.count();
    if (storyCount === 0) {
      const story = await prisma.story.create({
        data: {
          title: 'Khởi Nguyên Chi Thần (Demo)',
          slug: 'khoi-nguyen-chi-than',
          author: 'Lão Bản',
          short_description: 'Một câu chuyện tu tiên huy hoàng trong kỷ nguyên công nghệ.',
          full_description: '<p>Đây là câu chuyện mô tả hành trình từ một thiếu niên bình phàm bước lên đỉnh cao vũ trụ...</p>',
          genres: 'Tiên Hiệp, Huyền Huyễn',
          is_featured: true,
          status: 'ONGOING',
        }
      });

      const part = await prisma.storyPart.create({
        data: {
          story_id: story.id,
          title: 'Thiên Đạo Luân Hồi',
          part_number: 1,
          description: 'Hành trình ban đầu tại tiểu thế giới.',
        }
      });

      await prisma.chapter.create({
        data: {
          story_id: story.id,
          part_id: part.id,
          title: 'Chương 1: Trọng sinh lúc sấm sét',
          chapter_number: 1,
          slug: 'chuong-1-trong-sinh',
          content: '<p>Trời mưa u ám, sấm chớp ầm ầm. Hắn từ từ mở mắt, phát hiện xung quanh xa lạ...</p>',
          is_published: true,
        }
      });
    }

    return NextResponse.json({ message: "Seeding complete. Admin is 'admin' / 'admin'" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
