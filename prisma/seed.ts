import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

// Khởi tạo trực tiếp config trong Seed để tránh lỗi alias path của TypeScript
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Bắt đầu chạy seed database...`);

  // 1. Tạo tài khoản Admin mặc định
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const password_hash = await bcrypt.hash('Khach@123', 12);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password_hash,
      },
    });
    console.log(`Đã tạo Admin mặc định.`);
  } else {
    // Update password for existing admin
    const password_hash = await bcrypt.hash('Khach@123', 12);
    await prisma.admin.updateMany({
      where: { username: 'admin' },
      data: { password_hash },
    });
    console.log(`Đã cập nhật mật khẩu Admin.`);
  }

  // 2. Thêm Truyện 1: Khởi Nguyên Chi Thần
  const story1 = await prisma.story.upsert({
    where: { slug: 'khoi-nguyen-chi-than' },
    update: {},
    create: {
      title: 'Khởi Nguyên Chi Thần',
      slug: 'khoi-nguyen-chi-than',
      author: 'Lão Bản',
      short_description: 'Một câu chuyện tu tiên huy hoàng trong kỷ nguyên công nghệ.',
      full_description: '<p>Đây là câu chuyện mô tả hành trình từ một thiếu niên bình phàm bước lên đỉnh cao vũ trụ, phá vỡ trói buộc của Thiên Đạo.</p>',
      genres: 'Tiên Hiệp, Huyền Huyễn',
      is_featured: true,
      status: 'ONGOING',
    },
  });

  // Tạo phần cho Truyện 1
  const part1_s1 = await prisma.storyPart.upsert({
    where: { story_id_part_number: { story_id: story1.id, part_number: 1 } },
    update: {},
    create: {
      story_id: story1.id,
      title: 'Phần 1: Tiểu Thế Giới',
      part_number: 1,
      description: 'Hành trình ban đầu tại tiểu thế giới.',
    },
  });

  // Thêm các chương cho Truyện 1 -> Phần 1
  const chapterContents = [
    { num: 1, slug: 'chuong-1-trong-sinh', title: 'Chương 1: Trọng sinh lúc sấm sét' },
    { num: 2, slug: 'chuong-2-linh-can', title: 'Chương 2: Thức tỉnh Linh căn' },
    { num: 3, slug: 'chuong-3-sat-co', title: 'Chương 3: Sát cơ ngầm' }
  ];

  for (const chap of chapterContents) {
    await prisma.chapter.upsert({
      where: { story_id_chapter_number: { story_id: story1.id, chapter_number: chap.num } },
      update: {},
      create: {
        story_id: story1.id,
        part_id: part1_s1.id,
        title: chap.title,
        chapter_number: chap.num,
        slug: chap.slug,
        content: `<p>Nội dung đang được cập nhật cho ${chap.title}. Đây là văn bản mẫu giả định rằng nội dung truyện rất dài, hấp dẫn và cuốn hút người xem vào một không gian nghệ thuật ngôn chuẩn...</p><p>Hắn khẽ khép mắt, cắn răng vận chuyển chân khí trong đan điền...</p>`,
        is_published: true,
      },
    });
  }

  // 3. Thêm Truyện 2: Tinh Tế Kiếm Tôn
  const story2 = await prisma.story.upsert({
    where: { slug: 'tinh-te-kiem-ton' },
    update: {},
    create: {
      title: 'Tinh Tế Kiếm Tôn',
      slug: 'tinh-te-kiem-ton',
      author: 'Mặc Dạ',
      short_description: 'Sử dụng cổ kiếm pháp đánh bại các chủng tộc tinh không ngoài vũ trụ.',
      full_description: '<p>Sự kết hợp giữa mecha khoa học kỹ thuật và kiếm pháp cổ đại. Nhất kiếm phá vạn pháp!</p>',
      genres: 'Khoa Huyễn, Kiếm Hiệp',
      is_featured: false,
      status: 'ONGOING',
    },
  });

  const part1_s2 = await prisma.storyPart.upsert({
    where: { story_id_part_number: { story_id: story2.id, part_number: 1 } },
    update: {},
    create: {
      story_id: story2.id,
      title: 'Phần 1: Hành Tinh Rác',
      part_number: 1,
    },
  });

  await prisma.chapter.upsert({
    where: { story_id_chapter_number: { story_id: story2.id, chapter_number: 1 } },
    update: {},
    create: {
      story_id: story2.id,
      part_id: part1_s2.id,
      title: 'Chương 1: Thanh kiếm sắt vụn',
      chapter_number: 1,
      slug: 'chuong-1-thanh-kiem-sat-vun',
      content: '<p>Tại bãi rác trung tâm số 7 của tinh hệ rực rỡ, một thiếu niên nhặt được thanh kiếm gỉ sét. Không ai biết thanh kiếm ấy từng trảm qua Tinh Toàn...</p>',
      is_published: true,
    },
  });

  console.log(`Đã seed thành công cấu trúc truyện và chương.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
