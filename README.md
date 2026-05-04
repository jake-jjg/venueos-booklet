# VenueOS Booklet

A Nuxt.js web app that gives wedding venues a customisable, branded front end for presenting their information to prospective clients. Venue owners can manage content through a built-in settings panel, while guests browse a clean, paginated booklet experience.

## Features

- **Dynamic module pages** — content is driven by Supabase, with each venue module (e.g. About, Pricing, Gallery) rendered as its own page
- **Settings panel** — manage modules, theme, typography, and design options from a dedicated settings layout
- **Dark / light mode** — built-in colour mode toggle via Nuxt UI
- **SEO ready** — per-page meta titles and descriptions using `useSeoMeta`, with a global title template derived from the venue name

## Tech Stack

| | |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI | [Nuxt UI 4](https://ui.nuxt.com) |
| Database | [Supabase](https://supabase.com) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Language | TypeScript |

## Different Routes

By default there are two routes. 
- 'http://localhost:300/'
- 'http://localhost:300/customize/'


## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VENUE_ID=your-venue-id
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run generate` | Statically generate the site |
| `npm run preview` | Preview the production build |
