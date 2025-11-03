// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import configEnv from './config';

cloudinary.config({
  cloud_name: configEnv.env.cloudinary.cloudName,
  api_key: configEnv.env.cloudinary.apiKey,
  api_secret: configEnv.env.cloudinary.apiSecret,
});

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'products',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || '');
          }
        }
      );
  
      uploadStream.end(buffer);
    });

  
  } catch (error: unknown) {
    let msg = 'Something went wrong';
    if (typeof error === 'string') msg = error;
    else if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }
};

export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    return Promise.all(uploadPromises);
      
  } catch (error: unknown) {
    let msg = 'Something went wrong';
    if (typeof error === 'string') msg = error;
    else if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }
};

export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public ID from Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      console.warn('Could not extract public ID from URL:', imageUrl);
      return;
    }

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result, 'result')
    
    if (result !== 'ok') {
      console.warn('Failed to delete image from Cloudinary:', publicId, result);
    }
    
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloudname/image/upload/v1234567/public_id.jpg
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|webp|gif)/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}

// Optional: Bulk delete function
export async function deleteMultipleFromCloudinary(urls: string[]): Promise<void> {
  try {
    
    const deletePromises = urls.map(url => deleteFromCloudinary(url));
    await Promise.allSettled(deletePromises);
  } catch (error: unknown) {
    let msg = 'Something went wrong';
    if (typeof error === 'string') msg = error;
    else if (error instanceof Error) msg = error.message;
    throw new Error(msg);
  }
}

export default cloudinary;