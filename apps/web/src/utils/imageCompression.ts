/**
 * Compress and resize an image file
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default: 1920)
 * @param maxHeight - Maximum height (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.8)
 * @returns Promise<string> - Base64 data URL of compressed image
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Check if compressed size is acceptable (max 1MB per image)
            if (blob.size > 1024 * 1024) {
              // If still too large, reduce quality further
              canvas.toBlob(
                (smallerBlob) => {
                  if (!smallerBlob) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }
                  const reader2 = new FileReader();
                  reader2.onload = () => resolve(reader2.result as string);
                  reader2.onerror = () => reject(new Error('Failed to read compressed image'));
                  reader2.readAsDataURL(smallerBlob);
                },
                file.type || 'image/jpeg',
                quality * 0.7 // Further reduce quality
              );
            } else {
              const reader2 = new FileReader();
              reader2.onload = () => resolve(reader2.result as string);
              reader2.onerror = () => reject(new Error('Failed to read compressed image'));
              reader2.readAsDataURL(blob);
            }
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

