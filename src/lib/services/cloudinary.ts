import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads an image base64 string to Cloudinary
 * @param base64Image The image as a base64 Data URI string (e.g. data:image/jpeg;base64,... )
 * @param folder The folder in Cloudinary to store the image
 * @returns UploadResult containing url and publicId
 */
export async function uploadImage(base64Image: string, folder: string = 'truyenchu'): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image.");
  }
}

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
}
