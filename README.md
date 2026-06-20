# E-Commerce Online Store

A modern, server-side rendered e-commerce storefront built with TanStack Start, React 19, TypeScript, and Tailwind CSS.

---

## Prerequisites

Make sure you have the following installed before you start:

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org/) | 20+ | Required runtime |
| [Bun](https://bun.sh/) | 1.1+ | Package manager & runtime used by this project |

> **Why Bun?** This project uses `bun.lock` and `bunfig.toml`, so npm/yarn/pnpm are not supported without extra steps.

### Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd screenshot-exact-clone-12
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start the development server

```bash
bun run dev
```

The app will be available at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the development server with hot-reload |
| `bun run build` | Build for production (SSR, node-server preset) |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint across the project |
| `bun run format` | Format all files with Prettier |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR React meta-framework) |
| Router | [TanStack Router](https://tanstack.com/router) (file-based routing) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (New York style) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Carousel | [Swiper](https://swiperjs.com/) + [Embla Carousel](https://www.embla-carousel.com/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Language | TypeScript 5 |
| Build Tool | [Vite 7](https://vitejs.dev/) |
| Package Manager | [Bun](https://bun.sh/) |

---

## Project Structure

```
src/
├── components/         # Page-level components
│   ├── ui/             # shadcn/ui base components
│   ├── Benefits.tsx
│   ├── FAQ.tsx
│   ├── HeroVideo.tsx
│   ├── OrderSummary.tsx
│   ├── ProductCarousel.tsx
│   ├── ProductInfo.tsx
│   ├── QuantitySelector.tsx
│   ├── StickyBuy.tsx
│   └── Testimonials.tsx
├── data/               # Static data / mock data
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
├── routes/             # File-based routes (TanStack Router)
│   └── __root.tsx      # Root layout
├── router.tsx          # Router configuration
├── server.ts           # SSR server entry point
├── start.ts            # TanStack Start instance
└── styles.css          # Global styles + Tailwind CSS
```

---

## Adding shadcn/ui Components

This project uses shadcn/ui. To add new components:

```bash
bunx shadcn@latest add <component-name>

# Examples:
bunx shadcn@latest add table
bunx shadcn@latest add toast
```

---

## Production Build

```bash
# Build the app
bun run build

# Preview the built output
bun run preview
```

The server preset is `node-server`. The output will be in the `.output/` directory.

---

## Environment Variables

Create a `.env.local` file in the root directory for local overrides (this file is gitignored):

```env
# Add your environment variables here
# VITE_API_URL=https://your-api.com
```

> All variables exposed to the client must be prefixed with `VITE_`.
