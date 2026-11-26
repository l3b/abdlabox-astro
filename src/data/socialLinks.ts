// src/data/socialLinks.ts

export const PROFILES = {
  github: {
    username: 'l3b',
    url: 'https://github.com/l3b',
  },
  bluesky: {
    handle: 'abdla.box',
    url: 'https://bsky.app/profile/abdla.box',
  },
  strava: {
    athleteId: '7746516',
    url: 'https://www.strava.com/athletes/7746516',
  },
  goodreads: {
    userId: '4693662',
    widgetUrl: 'https://www.goodreads.com/review/grid_widget/4693662?shelf=currently-reading',
    url: 'https://www.goodreads.com/user/show/4693662-abdullah-althani',
  },
  trakt: {
    username: 'althani',
    url: 'https://trakt.tv/users/althani',
  },
  linkedin: {
    url: 'https://linkedin.com/in/abdullahalthani',
  },
  medium: {
    url: 'https://medium.com/@AbdullahALThani',
  },
  coursera: {
    url: 'https://www.coursera.org/learner/abdullahalthani',
  },
  duolingo: {
    url: 'https://www.duolingo.com/profile/AbdullahAlthani',
  },
  imdb: {
    url: 'https://www.imdb.com/user/ur54816740',
  },
} as const;

export const categoryTranslations: Record<string, string> = {
  Professional: 'مهني',
  Social: 'تواصل',
  Writing: 'كتابة',
  Activity: 'نشاط',
  Learning: 'تعلم',
  Reading: 'قراءة',
  Media: 'وسائط',
  Other: 'أخرى',
};

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  category: string;
}

const socialLinks: SocialLink[] = [
  // Professional
  {
    name: 'LinkedIn',
    url: PROFILES.linkedin.url,
    icon: 'simple-icons:linkedin',
    category: 'Professional',
  },
  {
    name: 'GitHub',
    url: PROFILES.github.url,
    icon: 'simple-icons:github',
    category: 'Professional',
  },
  // Social
  {
    name: 'Bluesky',
    url: PROFILES.bluesky.url,
    icon: 'simple-icons:bluesky',
    category: 'Social',
  },
  // Writing
  {
    name: 'Medium',
    url: PROFILES.medium.url,
    icon: 'simple-icons:medium',
    category: 'Writing',
  },
  // Reading
  {
    name: 'Goodreads',
    url: PROFILES.goodreads.url,
    icon: 'simple-icons:goodreads',
    category: 'Reading',
  },
  // Activity
  {
    name: 'Strava',
    url: PROFILES.strava.url,
    icon: 'simple-icons:strava',
    category: 'Activity',
  },
  // Learning
  {
    name: 'Coursera',
    url: PROFILES.coursera.url,
    icon: 'simple-icons:coursera',
    category: 'Learning',
  },
  {
    name: 'Duolingo',
    url: PROFILES.duolingo.url,
    icon: 'simple-icons:duolingo',
    category: 'Learning',
  },
  // Media
  {
    name: 'Trakt.tv',
    url: PROFILES.trakt.url,
    icon: 'simple-icons:trakt',
    category: 'Media',
  },
  {
    name: 'IMDb',
    url: PROFILES.imdb.url,
    icon: 'simple-icons:imdb',
    category: 'Media',
  },
];

export const footerSocialLinks = [
  { name: 'GitHub', url: PROFILES.github.url, icon: 'simple-icons:github' },
  { name: 'Bluesky', url: PROFILES.bluesky.url, icon: 'simple-icons:bluesky' },
  { name: 'Strava', url: PROFILES.strava.url, icon: 'simple-icons:strava' },
  { name: 'Goodreads', url: PROFILES.goodreads.url, icon: 'simple-icons:goodreads' },
  { name: 'Trakt', url: PROFILES.trakt.url, icon: 'simple-icons:trakt' },
];

export default socialLinks;
