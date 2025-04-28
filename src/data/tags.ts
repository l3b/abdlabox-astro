import { z } from 'astro:content';

export interface TagTranslation {
  en: string;
  ar: string;
  slug: {
    en: string;
    ar: string;
  };
}

const baseTagTranslations: Record<string, TagTranslation> = {
  astro: {
    en: 'Astro',
    ar: 'أسترو',
    slug: {
      en: 'astro',
      ar: 'استرو'
    }
  },
  learning: {
    en: 'Learning',
    ar: 'تعلم',
    slug: {
      en: 'learning',
      ar: 'تعلم'
    }
  },
  technology: {
    en: 'Technology',
    ar: 'تقنية',
    slug: {
      en: 'technology',
      ar: 'تقنية'
    }
  },
  'artificial-intelligence': {
    en: 'Artificial Intelligence',
    ar: 'ذكاء إصطناعي',
    slug: {
      en: 'artificial-intelligence',
      ar: 'ذكاء-اصطناعي'
    }
  },
  'web-development': {
    en: 'Web Development',
    ar: 'تطوير الويب',
    slug: {
      en: 'web-development',
      ar: 'تطوير-الويب'
    }
  }
};

// Helper function to find tag by any property
export function findTagByValue(value: string): TagTranslation | undefined {
  return Object.values(baseTagTranslations).find(tag => 
    tag.en === value || 
    tag.ar === value || 
    tag.slug.en === value || 
    tag.slug.ar === value
  );
}

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export const tags = baseTagTranslations;