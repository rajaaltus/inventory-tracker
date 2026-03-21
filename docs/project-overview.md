# Team Asset Tracker — Project Overview

> **Purpose:** An internal SaaS tool for companies to track hardware (laptops, monitors) and software licenses assigned to employees. Built as a training project to teach interns key concepts in Next.js and Convex.

## Executive Summary

Team Asset Tracker is a full-stack web application that demonstrates relational data modeling, file storage, admin dashboards, and role-based rendering. It uses **Next.js** for the frontend with **Convex** as a real-time backend-as-a-service (BaaS), giving interns hands-on experience with modern web development patterns.

## Tech Stack Summary

| Category         | Technology               | Version  | Purpose                              |
| ---------------- | ------------------------ | -------- | ------------------------------------ |
| Framework        | Next.js (App Router)     | 16.1.7   | Server/client rendering, routing     |
| UI Library       | React                    | 19.2.4   | Component-based UI                   |
| Language         | TypeScript               | 5.9.3    | Type-safe JavaScript                 |
| Backend          | Convex                   | 1.33.1   | Real-time database, serverless funcs |
| Authentication   | @convex-dev/auth          | 0.0.87   | Password-based auth with sessions    |
| Styling          | Tailwind CSS             | 4.2.1    | Utility-first CSS framework          |
| Component Library| shadcn/ui (Radix Nova)   | —        | Pre-built accessible components      |
| Theme            | next-themes              | 0.4.6    | Dark/light mode support              |

## Architecture Classification

- **Repository Type:** Monolith
- **Architecture Pattern:** Component-based frontend + serverless BaaS backend
- **Rendering:** Hybrid (Server Components + Client Components)
- **Data Layer:** Convex real-time database with reactive queries
- **Auth Model:** Middleware-based route protection with Convex Auth

## Key Learning Objectives

This project teaches interns:

1. **Relational Data Modeling** — Linking "Assets" to "Users" (employees) using Convex schema definitions and foreign key patterns
2. **File Storage** — Uploading receipts or photos of equipment using Convex File Storage
3. **Admin Dashboard** — Building a high-level view of available vs. assigned inventory with stats and filtering
4. **Role-Based Rendering** — Conditional UI rendering based on user roles (admin vs. employee)

## Links to Detailed Documentation

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Data Models](./data-models.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
