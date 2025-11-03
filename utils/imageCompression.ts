// utils/imageCompression.ts
export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export const compressImage = async (
  file: File, 
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeMB = 1
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // Fallback to original file
            return;
          }

          // Check if compressed size is within limits
          if (blob.size > maxSizeMB * 1024 * 1024) {
            // If still too large, recursively compress with lower quality
            if (quality > 0.4) {
              compressImage(file, { ...options, quality: quality - 0.1 })
                .then(resolve)
                .catch(() => resolve(file));
            } else {
              resolve(file); // Fallback to original
            }
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      console.warn('Image compression failed, using original file');
      resolve(file); // Fallback to original file
    };

    // Skip compression for non-image files or very small files
    if (!file.type.startsWith('image/') || file.size < 100 * 1024) { // 100KB
      resolve(file);
      return;
    }

    img.src = URL.createObjectURL(file);
  });
};

export const compressMultipleImages = async (
  files: File[], 
  options?: CompressionOptions
): Promise<File[]> => {
  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file, options))
  );
  return compressedFiles;
};

// Utility to show file size in readable format
export const getFileSizeMB = (file: File): string => {
  return (file.size / 1024 / 1024).toFixed(2);
};