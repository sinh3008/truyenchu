export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Helper to generate a SHA-1 hex string
 */
async function digestMessage(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function uploadImage(
  base64Image: string,
  folder: string = "truyenchu"
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary credentials");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Create signature for Cloudinary Authentication
  // signature string must be alphabetically sorted params
  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = await digestMessage(signatureString);

  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Cloudinary upload failed:", errorData);
    throw new Error("Failed to upload image.");
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary credentials");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await digestMessage(signatureString);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    console.error("Cloudinary delete failed:", await response.text());
    return false;
  }

  const result = await response.json();
  return result.result === "ok";
}
