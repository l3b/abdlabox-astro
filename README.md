# Abdla.box - Personal Digital Space

> A bilingual (Arabic/English) personal website built with Astro, featuring dynamic content integration, live activity feeds, and a unique "Electric Dunes" visual identity.

## 🌟 Overview

**Abdla.box** is a personal digital platform that bridges technology, culture, and curiosity. Built with modern web technologies, it serves as a hub for sharing knowledge, showcasing projects, and connecting with the community through various digital channels.

### Live at: [abdla.box](https://abdla.box)

## ✨ Features

### Core Functionality
- **🌐 Bilingual Support**: Full Arabic and English support with RTL/LTR layouts
- **📝 Blog System**: Markdown-based blogging with tag categorization
- **🔄 Live Activity Feeds**: Real-time integration with:
  - GitHub activity tracking
  - Bluesky social posts
  - Goodreads reading list
  - Trakt.tv watching history
  - Strava fitness activities
- **🎨 Electric Dunes Theme**: Custom visual identity inspired by Saudi desert landscapes
- **📱 Responsive Design**: Optimized for all devices with Tailwind CSS
- **🚀 Performance**: Static site generation with Astro for lightning-fast loads
- **📊 Analytics Ready**: Integrated analytics tracking support

### Content Categories
- **Tech & AI** - Technology insights and AI explorations
- **Knowledge Management** - Learning resources and methodologies
- **Sports & Running** - Fitness journey and activities
- **Dammam Diaries** - Local perspectives from Eastern Saudi Arabia
- **Faith Reflections** - Islamic thoughts and spiritual insights
- **Life & Society** - Social observations and cultural commentary

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v5.7
- **Styling**: Tailwind CSS v3.4 with Typography plugin
- **Icons**: Astro Icon with MDI and Simple Icons
- **Languages**: TypeScript, JavaScript
- **Content**: Markdown with frontmatter
- **APIs**: Integration with GitHub, Bluesky (AT Protocol), Goodreads RSS, Trakt.tv, TMDB, Strava

## 📁 Project Structure

```
abdlabox-astro/
├── public/                 # Static assets
│   ├── images/            # Blog and site images
│   ├── favicon files      # Site icons
│   └── site.webmanifest   # PWA manifest
├── src/
│   ├── assets/            # Source assets
│   ├── components/        # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── OptimizedImage.astro
│   │   ├── EmptyState.astro
│   │   ├── StravaStats.astro
│   │   └── Welcome.astro
│   ├── content/           # Blog content
│   │   ├── blog/
│   │   │   ├── ar/       # Arabic blog posts
│   │   │   └── en/       # English blog posts
│   │   └── config.js     # Content configuration
│   ├── data/              # Data files
│   │   ├── analytics.ts
│   │   ├── socialLinks.ts
│   │   └── tags.ts
│   ├── layouts/           # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── Layout.astro
│   ├── pages/             # Route pages
│   │   ├── ar/           # Arabic pages
│   │   ├── en/           # English pages
│   │   └── index.astro   # Homepage
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
│       ├── i18n.ts
│       ├── readingTime.ts
│       ├── stravaApi.ts
│       └── structuredData.ts
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/l3b/abdlabox-astro.git
cd abdlabox-astro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

## 📝 Available Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## 🌍 Deployment

### Cloudflare Pages (Recommended)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18+

3. Set up branch deployments:
   - **Production branch**: `main` → `abdla.box`
   - **Staging branch**: `staging` → `staging.abdla.box`

4. Environment variables (if needed):
   - Add any API keys or configuration through Cloudflare dashboard

### Other Platforms
The site can be deployed to any static hosting service:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront

## 🎨 Customization

### Brand Colors (Electric Dunes Theme)
- **Primary**: Electric Blue `#0EA5E9`
- **Accent**: Desert Orange `#F97316`
- **Background**: Near Black `#0A0A0A`
- **Text**: Off-white `#FAFAFA`

### Adding Blog Posts

Create a new `.md` file in `src/content/blog/[language]/`:

```markdown
---
title: "Your Post Title"
description: "Brief description"
pubDate: 2024-01-31
tags: ["tech", "ai"]
isDraft: false
---

Your content here...
```

### Modifying Social Links

Edit `src/data/socialLinks.ts` to update social media profiles and links.

## 🔧 Configuration

### Astro Config
Main configuration in `astro.config.mjs`:
- Site URL
- i18n settings
- Markdown rendering
- Integrations

### Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:
```env
# Bluesky API
BLUESKY_IDENTIFIER=your.handle.bsky.social
BLUESKY_APP_PASSWORD=your_app_password

# Trakt API (for watch history)
TRAKT_API_KEY=your_trakt_api_key

# TMDB API (for movie/TV posters)
TMDB_API_KEY=your_tmdb_api_key

# Strava API (for fitness tracking)
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token
```

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [AT Protocol (Bluesky)](https://atproto.com)

## 🤝 Contributing

While this is a personal website, suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share ideas for content or features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Abdullah Al-Thani (Abdla)**
- Website: [abdla.box](https://abdla.box)
- GitHub: [@l3b](https://github.com/l3b)
- Bluesky: [@abdla.box](https://bsky.app/profile/abdla.box)

---

Built with ❤️ and Astro 🚀