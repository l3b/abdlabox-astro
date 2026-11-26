export interface ImageUploadConfig {
  bucketUrl: string;
  enableCfTransform: boolean;
}

export class CloudflareImageManager {
  private config: ImageUploadConfig;

  constructor(config: ImageUploadConfig) {
    this.config = config;
  }

  get isTransformEnabled(): boolean {
    return this.config.enableCfTransform;
  }

  // Generate R2 image URL, optionally using Cloudflare Image Transformations
  // (comma-separated directives per Cloudflare's /cdn-cgi/image specification)
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
    const cleanPath = imagePath.replace(/^\/+/, '');
    const directUrl = this.getR2ImageUrl(cleanPath);

    if (!this.config.enableCfTransform) {
      return directUrl;
    }

    const { width, height, quality = 85, format = 'auto', fit = 'scale-down' } = options;
    const directives: string[] = [];

    if (width) directives.push(`width=${width}`);
    if (height) directives.push(`height=${height}`);
    directives.push(`quality=${quality}`);
    directives.push(`format=${format}`);
    directives.push(`fit=${fit}`);

    return `https://abdla.box/cdn-cgi/image/${directives.join(',')}/${directUrl}`;
  }

  getR2ImageUrl(imagePath: string): string {
    const base = this.config.bucketUrl.replace(/\/+$/, '');
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${base}/${cleanPath}`;
  }
}

const bucketUrl =
  import.meta.env.R2_BUCKET_URL ||
  (typeof process !== 'undefined' ? process.env.R2_BUCKET_URL : '') ||
  'https://img.abdla.box';

const enableCfTransform =
  (import.meta.env.PUBLIC_CF_IMAGE_TRANSFORM ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_CF_IMAGE_TRANSFORM : '')) === 'true';

export const imageConfig: ImageUploadConfig = {
  bucketUrl,
  enableCfTransform,
};

export const imageManager = new CloudflareImageManager(imageConfig);
