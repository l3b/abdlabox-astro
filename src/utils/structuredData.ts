
export interface PersonSchema {
  "@context": string;
  "@type": string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
}

export interface BlogPostSchema {
  "@context": string;
  "@type": string;
  headline: string;
  author: {
    "@type": string;
    name: string;
  };
  datePublished: string;
  dateModified?: string;
  description?: string;
  mainEntityOfPage: string;
  image?: string;
  publisher: {
    "@type": string;
    name: string;
  };
}

export interface WebsiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  author: {
    "@type": string;
    name: string;
  };
  inLanguage: string[];
}

export function generatePersonSchema(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Abdla",
    jobTitle: "Technology Consultant",
    description: "Technology Consultant and Runner sharing insights on tech, productivity, and personal growth.",
    url: "https://abdla.box",
    sameAs: [
      "https://linkedin.com/in/abdullahalthani",
      "https://github.com/l3b",
      "https://medium.com/@AbdullahALThani",
      "https://www.goodreads.com/althani",
      "https://www.strava.com/athletes/abdullahalthani",
      "https://www.coursera.org/learner/abdullahalthani"
    ]
  };
}

export function generateBlogPostSchema(
  title: string,
  description: string | undefined,
  pubDate: Date,
  updatedDate: Date | undefined,
  slug: string,
  featuredImageUrl?: string
): BlogPostSchema {
  const baseUrl = "https://abdla.box";
  const postUrl = `${baseUrl}/en/blog/${slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    author: {
      "@type": "Person",
      name: "Abdla"
    },
    datePublished: pubDate.toISOString(),
    ...(updatedDate && { dateModified: updatedDate.toISOString() }),
    ...(description && { description }),
    mainEntityOfPage: postUrl,
    ...(featuredImageUrl && { image: `${baseUrl}${featuredImageUrl}` }),
    publisher: {
      "@type": "Person",
      name: "Abdla"
    }
  };
}

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    name: "Abdla's Personal Website",
    url: "https://abdla.box",
    description: "Technology insights from a consultant and runner - covering tech trends, productivity, and personal growth",
    author: {
      "@type": "Person",
      name: "Abdla"
    },
    inLanguage: ["en", "ar"]
  };
}
