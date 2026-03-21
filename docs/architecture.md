# Team Asset Tracker — Architecture

## Overview

The application follows a **component-based frontend** architecture with a **serverless BaaS backend** pattern. Next.js handles rendering and routing while Convex manages the database, real-time subscriptions, and server-side logic.

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  ┌─────────────────────────────────────────┐ │
│  │         Next.js App Router              │ │
│  │  ┌──────────┐  ┌────────────────────┐   │ │
│  │  │  Server   │  │  Client Components │   │ │
│  │  │Components │  │  (useQuery, etc.)  │   │ │
│  │  └────┬─────┘  └────────┬───────────┘   │ │
│  └───────┼─────────────────┼───────────────┘ │
└──────────┼─────────────────┼─────────────────┘
           │ preload         │ real-time sync
           ▼                 ▼
┌─────────────────────────────────────────────┐
│              Convex Backend                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Queries  │ │Mutations │ │  HTTP Routes│  │
│  │(read data)│ │(write)   │ │  (auth)     │  │
│  └────┬─────┘ └────┬─────┘ └──────┬──────┘  │
│       │             │              │          │
│  ┌────┴─────────────┴──────────────┴───────┐ │
│  │           Convex Database                │ │
│  │  ┌──────┐ ┌──────┐ ┌────────────────┐   │ │
│  │  │users │ │assets│ │ authAccounts   │   │ │
│  │  └──────┘ └──────┘ └────────────────┘   │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │           Convex File Storage            │ │
│  │       (receipts, photos, etc.)           │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Frontend Architecture

### Rendering Strategy

The app uses Next.js **App Router** with a hybrid rendering approach:

- **Server Components** — Used for initial page loads and SEO-friendly content (e.g., landing page sections, server-side data preloading)
- **Client Components** — Used for interactive elements (e.g., dashboard with real-time data, forms, theme toggles)

### Provider Hierarchy

```
<html>
  <body>
    <ThemeProvider>              ← Dark/light mode context
      <ConvexClientProvider>     ← Convex client + auth session
        {children}               ← Page content
      </ConvexClientProvider>
    </ThemeProvider>
  </body>
</html>
```

### Route Structure

| Route         | Type    | Protection | Purpose                        |
| ------------- | ------- | ---------- | ------------------------------ |
| `/`           | Public  | None       | Landing page with feature info |
| `/signin`     | Public  | Redirect if authed | Login/signup form     |
| `/dashboard`  | Private | Auth required | Main asset management view   |
| `/server`     | Private | Auth required | Server-side query example    |

### Middleware

`middleware.ts` handles route protection:
- Checks for `__convexAuthJWT` cookie
- Redirects unauthenticated users to `/signin` for protected routes
- Redirects authenticated users from `/signin` to `/dashboard`

## Backend Architecture (Convex)

### How Convex Works (For Interns)

Convex replaces a traditional backend server + database setup:

1. **Schema** (`src/convex/schema.ts`) — Define your database tables and their fields, similar to SQL table definitions
2. **Queries** — Read-only functions that fetch data reactively (UI auto-updates when data changes)
3. **Mutations** — Write functions that modify data (insert, update, delete)
4. **HTTP Routes** (`src/convex/http.ts`) — Handle HTTP requests (used for auth callbacks)
5. **File Storage** — Built-in file upload/download without needing S3 or similar

### Authentication Flow

```
User submits credentials
        │
        ▼
LoginForm → Convex Auth (signIn/signUp)
        │
        ▼
Convex creates session + sets JWT cookie
        │
        ▼
Middleware reads cookie → allows/blocks routes
        │
        ▼
ConvexClientProvider exposes auth state to components
```

## Design System

- **Component Library:** shadcn/ui with "new-york" style variant
- **Color System:** OKLCH color space with CSS custom properties
- **Theming:** Light and dark modes via `next-themes`
- **24 pre-built UI components** from shadcn/ui (buttons, cards, dialogs, etc.)

## Key Patterns for Interns

### 1. Client vs Server Components

```tsx
// Server Component (default in App Router) — no "use client" directive
// Can fetch data on the server, no JavaScript sent to browser
export default function Page() { ... }

// Client Component — needs "use client" at top
// Can use hooks, state, event handlers, Convex queries
"use client";
export default function Dashboard() { ... }
```

### 2. Convex Reactive Queries

```tsx
// Data automatically re-fetches when the database changes
const assets = useQuery(api.assets.list);
```

### 3. Protected Routes via Middleware

```tsx
// middleware.ts checks auth cookie before allowing access
const protectedRoutes = ["/dashboard", "/server"];
```
