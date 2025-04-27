// src/content/config.js
import { z, defineCollection } from 'astro:content';

// Define the schema for the blog collection
const blogCollection = defineCollection({
  type: 'content', // Type 'content' for Markdown (.md) or MDX (.mdx)
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), // Description is helpful but optional
    pubDate: z.date(), // Publication date
    updatedDate: z.date().optional(), // Optional date for updates
    author: z.string().default('Abdla'), // Default author, can be overridden
    language: z.enum(['en', 'ar']), // Ensure posts are marked English or Arabic
    tags: z.array(z.string()).optional(), // Optional list of tags
    isDraft: z.boolean().optional().default(false), // Optional draft status
    // Add any other fields you anticipate needing, e.g., heroImage: z.string().optional()
  }),
});

// Export a `collections` object containing all collections
export const collections = {
  'blog': blogCollection,
};