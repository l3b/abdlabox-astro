// Shared build-time feed fetchers with in-memory caching & parallel execution
import { BskyAgent, type ComAtprotoLabelDefs } from '@atproto/api';
import { formatDistanceToNow } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { PROFILES } from '../data/socialLinks';

const APP_USER_AGENT = 'AbdlaBox/1.0.0 (+https://abdla.box)';
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export interface ReadingBook {
  title: string;
  link: string;
  coverUrl?: string;
}

export interface WatchedItem {
  id: number;
  title: string;
  link: string;
  type: 'movie' | 'episode' | 'unknown';
  overview: string | null;
  posterUrl?: string;
  tmdbId?: number;
}

export interface BlueskyPost {
  text: string | null;
  uri: string;
  cid: string;
  postUrl: string;
  embedImageUrl?: string;
  embedLinkUrl?: string;
  embedLinkTitle?: string;
  replyParent?: string;
  reason?: string;
}

export interface GitHubEvent {
  id: string;
  display: string;
  link: string;
  timeAgo: string;
}

export interface HomeFeeds {
  currentlyReadingBooks: ReadingBook[];
  recentlyWatchedItems: WatchedItem[];
  latestBlueskyPosts: BlueskyPost[];
  latestGitHubEvents: GitHubEvent[];
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// --- In-memory build-time caches ---
let goodreadsCache: Promise<ReadingBook[]> | null = null;
const traktCache: Partial<Record<'ar' | 'en', Promise<WatchedItem[]>>> = {};
let blueskyRawFeedCache: Promise<any[] | null> | null = null;
let githubRawEventsCache: Promise<any[]> | null = null;

// --- Goodreads Currently Reading (via public grid_widget since Goodreads retired RSS) ---
export function getGoodreadsReading(): Promise<ReadingBook[]> {
  if (!goodreadsCache) {
    goodreadsCache = (async () => {
      const books: ReadingBook[] = [];
      try {
        const response = await fetch(PROFILES.goodreads.widgetUrl, {
          headers: { 'User-Agent': BROWSER_USER_AGENT },
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) {
          console.error(`Goodreads widget fetch failed: ${response.status}`);
          return books;
        }
        const rawJs = await response.text();
        // Unescape JS string quotes/slashes inside var widget_code = '...'
        const html = rawJs.replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/\\'/g, "'");
        const containerMatches = html.matchAll(
          /<div class="gr_grid_book_container">(.*?)<\/div>/gs
        );

        for (const match of containerMatches) {
          const block = match[1];
          const titleMatch = block.match(/<a[^>]+title="([^"]+)"/i);
          const hrefMatch = block.match(/<a[^>]+href="([^"]+)"/i);
          const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);

          const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : null;
          const link = hrefMatch ? decodeHtmlEntities(hrefMatch[1].trim()) : null;
          const coverUrl = imgMatch
            ? decodeHtmlEntities(imgMatch[1].trim()).replace(/\._SY75_\./, '._SY150_.')
            : undefined;

          if (title && link) {
            books.push({ title, link, coverUrl });
          }
          if (books.length >= 3) break;
        }
      } catch (error) {
        console.error('Error fetching Goodreads:', error);
      }
      return books;
    })();
  }
  return goodreadsCache;
}

// --- Trakt + TMDB Recently Watched ---
export function getTraktRecentlyWatched(locale: 'ar' | 'en'): Promise<WatchedItem[]> {
  if (!traktCache[locale]) {
    traktCache[locale] = (async () => {
      const TRAKT_API_KEY = import.meta.env.TRAKT_API_KEY;
      if (!TRAKT_API_KEY) {
        console.warn('TRAKT_API_KEY not set');
        return [];
      }

      try {
        const langQuery = locale === 'ar' ? '&languages=ar' : '';
        const traktUrl = `https://api.trakt.tv/users/${PROFILES.trakt.username}/history?limit=3&extended=full${langQuery}`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': APP_USER_AGENT,
          'trakt-api-version': '2',
          'trakt-api-key': TRAKT_API_KEY,
        };
        if (locale === 'ar') headers['Accept-Language'] = 'ar';

        const traktResponse = await fetch(traktUrl, {
          headers,
          signal: AbortSignal.timeout(8000),
        });
        if (!traktResponse.ok) {
          const errText = await traktResponse.text().catch(() => '');
          console.error(
            `Trakt fetch failed: ${traktResponse.status} ${errText.slice(0, 200)}`
          );
          return [];
        }

        const historyData = await traktResponse.json();
        if (!Array.isArray(historyData) || historyData.length === 0) return [];

        const items = historyData
          .map((item: any): WatchedItem | null => {
            const type = item.type || 'unknown';
            const id = item.id;
            let title = '';
            let link = '#';
            let overview: string | null = null;
            let tmdbId: number | undefined;

            try {
              if (type === 'movie' && item.movie?.ids?.slug) {
                title = item.movie.title || (locale === 'ar' ? 'فيلم غير معروف' : 'Unknown Movie');
                link = `https://trakt.tv/movies/${item.movie.ids.slug}`;
                overview = item.movie.overview ?? null;
                tmdbId = item.movie.ids?.tmdb;
              } else if (type === 'episode' && item.show?.ids?.slug && item.episode) {
                const showTitle =
                  item.show.title || (locale === 'ar' ? 'مسلسل غير معروف' : 'Unknown Show');
                const season = item.episode.season;
                const number = item.episode.number;
                const epTitle = item.episode.title ? ` - ${item.episode.title}` : '';
                const epCode =
                  locale === 'ar'
                    ? `م${String(season).padStart(2, '0')}ح${String(number).padStart(2, '0')}`
                    : `S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
                title = `${showTitle} ${epCode}${epTitle}`;
                link = `https://trakt.tv/shows/${item.show.ids.slug}/seasons/${season}/episodes/${number}`;
                overview = item.episode.overview || item.show.overview || null;
                tmdbId = item.show.ids?.tmdb;
              }
            } catch {
              return null;
            }
            return title && id ? { id, title, link, type, overview, tmdbId } : null;
          })
          .filter((item): item is WatchedItem => item !== null);

        const TMDB_API_KEY = import.meta.env.TMDB_API_KEY;
        if (TMDB_API_KEY) {
          await Promise.allSettled(
            items.map(async (item) => {
              if (!item.tmdbId) return;
              const mediaType = item.type === 'movie' ? 'movie' : 'tv';
              const langParam = locale === 'ar' ? '&language=ar' : '';
              const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${item.tmdbId}?api_key=${TMDB_API_KEY}${langParam}`;
              const tmdbRes = await fetch(tmdbUrl, {
                headers: { 'User-Agent': APP_USER_AGENT },
                signal: AbortSignal.timeout(6000),
              });
              if (tmdbRes.ok) {
                const tmdbData = await tmdbRes.json();
                if (tmdbData.poster_path) {
                  item.posterUrl = `https://image.tmdb.org/t/p/w200${tmdbData.poster_path}`;
                }
              }
            })
          );
        }

        return items;
      } catch (error) {
        console.error('Error fetching Trakt:', error);
        return [];
      }
    })();
  }
  return traktCache[locale]!;
}

// --- Bluesky Posts (single login & fetch per build, filtered per locale) ---
function loadRawBlueskyFeed(): Promise<any[] | null> {
  if (!blueskyRawFeedCache) {
    blueskyRawFeedCache = (async () => {
      const identifier = import.meta.env.BLUESKY_IDENTIFIER;
      const password = import.meta.env.BLUESKY_APP_PASSWORD;
      if (!identifier || !password) {
        console.warn('Bluesky credentials not set');
        return null;
      }
      try {
        const agent = new BskyAgent({ service: 'https://bsky.social' });
        await agent.login({ identifier, password });
        const response = await agent.app.bsky.feed.getAuthorFeed({
          actor: identifier,
          limit: 30,
        });
        return response.success ? response.data.feed : [];
      } catch (error) {
        console.error('Error fetching Bluesky:', error);
        return [];
      }
    })();
  }
  return blueskyRawFeedCache;
}

export async function getBlueskyPosts(locale: 'ar' | 'en'): Promise<BlueskyPost[]> {
  const feed = await loadRawBlueskyFeed();
  if (!feed || feed.length === 0) return [];

  const handle = import.meta.env.BLUESKY_IDENTIFIER || PROFILES.bluesky.handle;
  const hazardousLabels = ['porn', 'sexual', 'nudity'];

  return feed
    .map((feedItem): BlueskyPost | null => {
      const post = feedItem.post;
      const reason = feedItem.reason;
      if (!post?.record || !post.uri || !post.cid) return null;

      const langs = post.record.langs as string[] | undefined;
      if (!langs || !langs.includes(locale)) return null;

      const labels = post.labels as ComAtprotoLabelDefs.Label[] | undefined;
      if (labels?.some((label) => hazardousLabels.includes(label.val))) return null;

      let embedImageUrl: string | undefined;
      let embedLinkUrl: string | undefined;
      let embedLinkTitle: string | undefined;

      if (post.embed?.images && post.embed.$type === 'app.bsky.embed.images#view') {
        embedImageUrl = post.embed.images[0]?.thumb;
      } else if (post.embed?.external && post.embed.$type === 'app.bsky.embed.external#view') {
        embedImageUrl = post.embed.external.thumb;
        embedLinkUrl = post.embed.external.uri;
        embedLinkTitle = post.embed.external.title;
      }

      const rkey = post.uri.split('/').pop() ?? '';
      return {
        text: typeof post.record.text === 'string' ? post.record.text : null,
        uri: post.uri,
        cid: post.cid,
        postUrl: `https://bsky.app/profile/${handle}/post/${rkey}`,
        embedImageUrl,
        embedLinkUrl,
        embedLinkTitle,
        replyParent: post.record.reply?.parent?.uri,
        reason: reason?.$type,
      };
    })
    .filter((item): item is BlueskyPost => item !== null)
    .filter((item) => item.reason !== 'app.bsky.feed.defs#reasonRepost' || Boolean(item.text))
    .slice(0, 3);
}

// --- GitHub Public Events (fetched once per build, formatted per locale) ---
function loadRawGitHubEvents(): Promise<any[]> {
  if (!githubRawEventsCache) {
    githubRawEventsCache = (async () => {
      try {
        const url = `https://api.github.com/users/${PROFILES.github.username}/events/public?per_page=10`;
        const response = await fetch(url, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': APP_USER_AGENT,
          },
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
          console.error(`GitHub API fetch failed: ${response.status}`);
          return [];
        }
        const events = await response.json();
        return Array.isArray(events) ? events : [];
      } catch (error) {
        console.error('Error fetching GitHub events:', error);
        return [];
      }
    })();
  }
  return githubRawEventsCache;
}

export async function getGitHubEvents(locale: 'ar' | 'en'): Promise<GitHubEvent[]> {
  const events = await loadRawGitHubEvents();
  if (events.length === 0) return [];

  const dateLocale = locale === 'ar' ? arSA : enUS;
  const profileUrl = PROFILES.github.url;

  return events
    .map((event: any): GitHubEvent | null => {
      let display = '';
      let link = profileUrl;
      let timeAgo = '';

      if (event.created_at) {
        try {
          timeAgo = formatDistanceToNow(new Date(event.created_at), {
            addSuffix: true,
            locale: dateLocale,
          });
        } catch {
          // ignore invalid date
        }
      }

      const repoName = event.repo?.name;
      const repoUrl = repoName ? `https://github.com/${repoName}` : profileUrl;

      switch (event.type) {
        case 'PushEvent': {
          const commitCount = event.payload?.commits?.length || 0;
          if (commitCount > 0) {
            const commitMsg =
              event.payload?.commits?.[0]?.message?.split('\n')[0] ||
              (locale === 'ar' ? 'تحديث' : 'update');
            display =
              locale === 'ar'
                ? `دفع ${commitCount} ${commitCount === 1 ? 'تغيير' : 'تغييرات'} إلى ${repoName}: "${commitMsg}"`
                : `Pushed ${commitCount} ${commitCount === 1 ? 'commit' : 'commits'} to ${repoName}: "${commitMsg}"`;
            link =
              commitCount === 1 && event.payload?.commits?.[0]?.sha
                ? `https://github.com/${repoName}/commit/${event.payload.commits[0].sha}`
                : repoUrl;
          } else {
            display = locale === 'ar' ? `دفع إلى ${repoName}` : `Pushed to ${repoName}`;
            link = repoUrl;
          }
          break;
        }
        case 'CreateEvent': {
          const refType = event.payload?.ref_type;
          if (refType === 'repository') {
            display =
              locale === 'ar' ? `أنشأ المستودع ${repoName}` : `Created repository ${repoName}`;
            link = repoUrl;
          } else if (refType === 'branch' && event.payload.ref) {
            display =
              locale === 'ar'
                ? `أنشأ الفرع ${event.payload.ref} في ${repoName}`
                : `Created branch ${event.payload.ref} in ${repoName}`;
            link = `https://github.com/${repoName}/tree/${event.payload.ref}`;
          } else {
            display =
              locale === 'ar'
                ? `أنشأ ${refType || 'شيئًا'} في ${repoName}`
                : `Created ${refType || 'something'} in ${repoName}`;
            link = repoUrl;
          }
          break;
        }
        case 'WatchEvent':
          if (event.payload?.action === 'started') {
            display = locale === 'ar' ? `أعجب بالمستودع ${repoName}` : `Starred ${repoName}`;
            link = repoUrl;
          } else {
            return null;
          }
          break;
        case 'ForkEvent':
          display = locale === 'ar' ? `أنشأ نسخة من ${repoName}` : `Forked ${repoName}`;
          link = event.payload?.forkee?.html_url || repoUrl;
          break;
        case 'PublicEvent':
          display =
            locale === 'ar' ? `جعل المستودع ${repoName} عامًا` : `Made ${repoName} public`;
          link = repoUrl;
          break;
        default:
          return null;
      }

      return { id: event.id, display, link, timeAgo };
    })
    .filter((item): item is GitHubEvent => item !== null)
    .slice(0, 3);
}

export async function getHomeFeeds(locale: 'ar' | 'en'): Promise<HomeFeeds> {
  const [goodreads, trakt, bluesky, github] = await Promise.allSettled([
    getGoodreadsReading(),
    getTraktRecentlyWatched(locale),
    getBlueskyPosts(locale),
    getGitHubEvents(locale),
  ]);

  return {
    currentlyReadingBooks: goodreads.status === 'fulfilled' ? goodreads.value : [],
    recentlyWatchedItems: trakt.status === 'fulfilled' ? trakt.value : [],
    latestBlueskyPosts: bluesky.status === 'fulfilled' ? bluesky.value : [],
    latestGitHubEvents: github.status === 'fulfilled' ? github.value : [],
  };
}
