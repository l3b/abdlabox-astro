import { PROFILES } from '../data/socialLinks';

export interface PersonSchema {
  '@context': string;
  '@type': string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
}

export interface BlogPostSchema {
  '@context': string;
  '@type': string;
  headline: string;
  inLanguage: string;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  dateModified?: string;
  description?: string;
  mainEntityOfPage: string;
  image?: string;
  publisher: {
    '@type': string;
    name: string;
  };
}

export interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  inLanguage: string[];
}

const SITE_URL = 'https://abdla.box';

export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdla',
    jobTitle: 'Technology Consultant',
    description:
      'Technology Consultant and Runner sharing insights on tech, productivity, and personal growth.',
    url: SITE_URL,
    sameAs: [
      PROFILES.linkedin.url,
      PROFILES.github.url,
      PROFILES.bluesky.url,
      PROFILES.medium.url,
      PROFILES.goodreads.url,
      PROFILES.strava.url,
      PROFILES.coursera.url,
    ],
  };
}

export function generateBlogPostSchema(
  title: string,
  description: string | undefined,
  pubDate: Date,
  updatedDate: Date | undefined,
  slug: string,
  featuredImageUrl?: string,
  locale: 'ar' | 'en' = 'en'
): BlogPostSchema {
  const postUrl = `${SITE_URL}/${locale}/blog/${slug}`;
  const resolvedImage = featuredImageUrl
    ? featuredImageUrl.startsWith('http')
      ? featuredImageUrl
      : `${SITE_URL}${featuredImageUrl.startsWith('/') ? '' : '/'}${featuredImageUrl}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: 'Abdla',
    },
    datePublished: pubDate.toISOString(),
    ...(updatedDate && { dateModified: updatedDate.toISOString() }),
    ...(description && { description }),
    mainEntityOfPage: postUrl,
    ...(resolvedImage && { image: resolvedImage }),
    publisher: {
      '@type': 'Person',
      name: 'Abdla',
    },
  };
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abdla.box',
    url: SITE_URL,
    description:
      'Technology insights from a consultant and runner — covering tech trends, productivity, and personal growth.',
    author: {
      '@type': 'Person',
      name: 'Abdla',
    },
    inLanguage: ['ar', 'en'],
  };
}
