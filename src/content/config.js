
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    featuredImage: z.object({
      url: z.string().optional(),
      alt: z.string(),
      caption: z.string().optional(),
      // For R2 images, store just the path, we'll generate optimized URLs
      r2Path: z.string().optional()
    }).refine(data => data.url || data.r2Path, {
      message: "Either url or r2Path must be provided"
    }).optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Abdla'),
    language: z.enum(['en', 'ar']),
    tags: z.array(z.string()).optional(),
    isDraft: z.boolean().optional().default(false),
    translationKey: z.string().optional(), // Link between translations
  }),
});

export const collections = {
  'blog': blogCollection,
};
