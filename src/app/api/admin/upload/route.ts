import { NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/services/cloudinary';

// POST /api/admin/upload
export async function POST(request: Request) {
  try {
    const { image, publicId } = await request.json();

    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    // Delete old image if replacing
    if (publicId) {
      await deleteImage(publicId).catch(() => {});
    }

    const result = await uploadImage(image, 'truyenchu/covers');
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
