
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    featuredImage: z.object({
      url: z.string(),
      alt: z.string(),
      caption: z.string().optional()
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
