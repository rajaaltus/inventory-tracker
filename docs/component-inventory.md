# Team Asset Tracker — Component Inventory

## Custom Components

These are project-specific components that interns will work with and modify.

### Application Components

| Component                | File                               | Type   | Purpose                                    |
| ------------------------ | ---------------------------------- | ------ | ------------------------------------------ |
| `ConvexClientProvider`   | `components/ConvexClientProvider.tsx` | Client | Wraps app with Convex client + auth context |
| `LoginForm`              | `components/login-form.tsx`        | Client | Email/password form with sign-in/sign-up   |
| `ThemeProvider`          | `components/theme-provider.tsx`    | Client | Provides dark/light mode context            |
| `ThemeToggle`            | `components/theme-toggle.tsx`      | Client | Sun/moon icon button to switch themes       |

### Page Components

| Page         | File                       | Type   | Key Features                                |
| ------------ | -------------------------- | ------ | ------------------------------------------- |
| Landing      | `app/page.tsx`             | Server | Hero section, feature cards, stats animation |
| Sign In      | `app/signin/page.tsx`      | Server | Two-column layout, LoginForm integration     |
| Dashboard    | `app/dashboard/page.tsx`   | Client | Stat cards, tabs, asset tables, search       |
| Server Demo  | `app/server/page.tsx`      | Server | Preloaded Convex queries example             |

## shadcn/ui Components (Pre-built)

These are in `components/ui/` and generally don't need modification. They're imported and composed in custom components.

### Form Components
- `button.tsx` — Primary action buttons with variants
- `input.tsx` — Text input fields
- `textarea.tsx` — Multi-line text input
- `label.tsx` — Form field labels
- `select.tsx` — Dropdown select menus
- `combobox.tsx` — Searchable dropdown
- `field.tsx` — Form field wrapper with label + error
- `input-group.tsx` — Grouped inputs (e.g., prefix + input)

### Layout Components
- `card.tsx` — Content container with header/body/footer
- `separator.tsx` — Visual divider line
- `breadcrumb.tsx` — Navigation breadcrumbs

### Feedback Components
- `dialog.tsx` — Modal dialogs
- `alert-dialog.tsx` — Confirmation dialogs
- `popover.tsx` — Floating content panels
- `tooltip.tsx` — Hover tooltips
- `alert.tsx` — Inline alert messages
- `sonner.tsx` — Toast notifications (bottom-right)
- `skeleton.tsx` — Loading placeholder animations

### Data Display Components
- `tabs.tsx` — Tabbed content sections
- `avatar.tsx` — User profile images
- `chart.tsx` — Data visualization (Recharts-based)

## Component Patterns for Interns

### Using shadcn/ui Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Compose pre-built components
<Card>
  <CardHeader>
    <CardTitle>My Asset</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="outline">Edit</Button>
  </CardContent>
</Card>
```

### Client vs Server Component Decision

Ask yourself:
- Does it need `useState`, `useEffect`, or event handlers? → **Client Component** (`"use client"`)
- Does it need Convex `useQuery`/`useMutation`? → **Client Component**
- Is it just displaying static/server-fetched content? → **Server Component** (default)
