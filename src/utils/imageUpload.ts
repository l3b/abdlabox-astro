
export interface ImageUploadConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketUrl: string;
}

export class CloudflareImageManager {
  private config: ImageUploadConfig;

  constructor(config: ImageUploadConfig) {
    this.config = config;
  }

  // Generate optimized image URL with Cloudflare Image Resizing
  getOptimizedImageUrl(
    imagePath: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'auto';
      fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
    } = {}
  ): string {
    const { width, height, quality = 85, format = 'auto', fit = 'scale-down' } = options;
    
    const baseUrl = `https://abdla.box/cdn-cgi/image`;
    const params = new URLSearchParams();
    
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('quality', quality.toString());
    params.append('format', format);
    params.append('fit', fit);
    
    return `${baseUrl}/${params.toString()}/${this.config.bucketUrl}/${imagePath}`;
  }

  // For development - you can upload images manually to R2 via Cloudflare dashboard
  getR2ImageUrl(imagePath: string): string {
    return `${this.config.bucketUrl}/${imagePath}`;
  }
}

// Configuration using environment variables
export const imageConfig: ImageUploadConfig = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: 'abdla-blog-images',
  bucketUrl: process.env.R2_BUCKET_URL || ''
};

export const imageManager = new CloudflareImageManager(imageConfig);
