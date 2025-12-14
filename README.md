# BurgeRank

A modern web application for rating and ranking hamburgers across different cities.

## Tech Stack

- **Frontend**: Next.js 16.0.7 with TypeScript
- **UI Components**: Shadcn/ui, Framer Motion
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Bundle**: Turbopack

## Features

- 🍔 Hamburger rating and ranking system
- 🏆 User profiles with badges and rewards
- 📍 Location-based filtering
- ⭐ Detailed ratings by category
- 👥 Social features
- 🎯 Gamification with points and levels

## Getting Started

### Requirements

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (main)/        # Main application routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # Reusable React components
├── lib/
│   ├── hooks/         # Custom React hooks
│   ├── api/           # API integration
│   └── utils/         # Utility functions
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## License

Proprietary - All rights reserved
