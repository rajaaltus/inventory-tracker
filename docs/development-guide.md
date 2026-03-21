# Team Asset Tracker — Development Guide

## Prerequisites

- **Node.js** — v18+ recommended
- **npm** — Comes with Node.js
- **Convex Account** — Sign up at [convex.dev](https://convex.dev) (free tier available)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

```bash
npx convex dev
```

This will:
- Prompt you to log into Convex (first time)
- Create a new Convex project or link to an existing one
- Generate the `_generated/` files in `src/convex/`
- Start watching for schema/function changes

### 3. Set Up Auth Keys

```bash
node generateKeys.mjs
```

Follow the instructions to set up JWT signing keys for authentication.

### 4. Run the Development Server

```bash
npm run dev
```

This runs both Next.js and Convex dev servers concurrently. The app will be available at `http://localhost:3000`.

## Available Scripts

| Command          | What It Does                                      |
| ---------------- | ------------------------------------------------- |
| `npm run dev`    | Start Next.js + Convex dev servers                |
| `npm run build`  | Build Next.js for production                      |
| `npm start`      | Start production server                           |
| `npm run lint`   | Run ESLint to check code quality                  |

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
CONVEX_DEPLOYMENT=<your-convex-project-id>
```

These are automatically set when you run `npx convex dev` for the first time.

## Project Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `LoginForm.tsx`) or `kebab-case.tsx` (e.g., `login-form.tsx`)
- Pages: Always `page.tsx` inside route folders (Next.js convention)
- Convex functions: `camelCase.ts`

### Import Aliases
- `@/` maps to project root (configured in `tsconfig.json`)
- Example: `import { Button } from "@/components/ui/button"`

### Code Style
- **Prettier** for formatting (see `.prettierrc`)
- **ESLint** for code quality (see `eslint.config.mjs`)
- **TypeScript** strict mode enabled

## Common Development Tasks

### Adding a New Page

1. Create a folder in `app/` with the route name
2. Add a `page.tsx` file inside it
3. If protected, add the route to `middleware.ts`

```
app/
  inventory/
    page.tsx    ← accessible at /inventory
```

### Adding a Convex Table

1. Edit `src/convex/schema.ts`
2. Define the table with `defineTable()` and validators
3. Save — Convex auto-deploys the schema change

### Adding a Convex Query/Mutation

1. Create a new `.ts` file in `src/convex/` (e.g., `assets.ts`)
2. Define queries with `query()` and mutations with `mutation()`
3. Import the auto-generated API reference in your component

```typescript
// src/convex/assets.ts
import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("assets").collect();
  },
});
```

### Uploading Files with Convex

```typescript
// 1. Generate upload URL (mutation)
const generateUploadUrl = useMutation(api.files.generateUploadUrl);

// 2. Upload file
const url = await generateUploadUrl();
const result = await fetch(url, {
  method: "POST",
  body: file,
});
const { storageId } = await result.json();

// 3. Save storageId to your document
await saveAsset({ receiptFileId: storageId });
```

### Adding a shadcn/ui Component

```bash
npx shadcn@latest add <component-name>
```

Example: `npx shadcn@latest add table` adds a table component to `components/ui/`.

## Troubleshooting

| Problem                        | Solution                                           |
| ------------------------------ | -------------------------------------------------- |
| Convex functions not updating  | Check `npx convex dev` is running                  |
| Auth not working               | Run `node generateKeys.mjs` and restart dev server |
| Types not found                | Run `npx convex dev` to regenerate `_generated/`   |
| Component import error         | Check `@/` alias resolves correctly in tsconfig    |
| Dark mode not toggling         | Ensure `ThemeProvider` wraps the app in layout.tsx  |
