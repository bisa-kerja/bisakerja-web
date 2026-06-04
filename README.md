# Bisakerja Frontend

Frontend web application for the Bisakerja platform. This service owns the user-facing presentation layer, client-side routing, form interactions, API consumption, and the visual experience consumed by end users.

Bisakerja is an AI-assisted career decision platform for Indonesian job seekers. The frontend exists to provide an intuitive, responsive interface for discovering relevant jobs, understanding job fit, improving CV quality, managing saved jobs, and tracking application outcomes.

## Table of Contents

- [Overview](#overview)
- [Platform Context](#platform-context)
- [Service Boundary](#service-boundary)
- [Feature Modules](#feature-modules)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Styling & Design System](#styling--design-system)
- [Deployment Notes](#deployment-notes)
- [Contribution Guide](#contribution-guide)

## Overview

The Bisakerja Frontend is the main web client for Bisakerja. It provides the user-facing interface for all product workflows, handles client-side state and navigation, manages authentication tokens, and communicates with the Backend API through a local Next.js proxy to avoid CORS issues.

This repository is responsible for:

- Landing page with feature showcase, testimonials, and call-to-action flows
- User registration, login, email verification, and password reset UI
- Job search, filtering, sorting, and job detail views
- AI Job Fit analysis presentation and interaction
- AI CV Analyzer with PDF upload, analysis loading states, and structured result display
- User profile management including skills, experience, education, and profile photo
- Saved jobs (bookmarks) management
- Application tracker with status management and history
- CV analysis history browsing
- Responsive layout with mobile-first design, animations, and dark-themed hero sections
- Client-side authentication state via React Context and localStorage
- API proxy layer through Next.js route handlers to the Backend API

The frontend should not contain business logic. It should present Backend API responses, capture user input, and delegate all data validation and workflow orchestration to the backend.

## Platform Context

Bisakerja is positioned as a decision layer for Indonesian job seekers, not only as a job listing interface. The product combines job discovery, profile and preference context, fit scoring, explainable recommendations, CV feedback, and application tracking.

The broader platform includes:

| Service     | Responsibility                                                              |
| ----------- | --------------------------------------------------------------------------- |
| Frontend UI | Presents discovery, fit analysis, CV analysis, preferences, and tracking UI |
| Backend API | Owns business workflows, auth, persistence access, and API contracts        |
| Scraper API | Collects and normalizes external job data                                   |
| Model API   | Produces fit scores, explanations, skill gaps, and CV analysis output       |
| PostgreSQL  | Stores users, jobs, preferences, applications, and AI result snapshots      |

The frontend calls the Backend API for all product workflows. It must not call Scraper API or Model API directly.

## Service Boundary

The Frontend owns:

- Page routing, layout, and navigation
- Client-side form validation and user input capture
- Authentication state management (token storage, refresh, logout)
- API request orchestration through the Next.js proxy
- Visual presentation of all data returned from the Backend API
- Responsive design, animations, and interactive UI components
- Static assets, mascots, logos, and brand imagery

The Frontend does not own:

- Business logic, data validation, or workflow orchestration
- User authentication decisions (JWT issuance, verification, or session management)
- Direct database access or Prisma operations
- Scraping, parsing, or normalization of external job data
- Model inference, fit scoring, or CV analysis computation
- API response envelope formatting or error code definitions

## Feature Modules

| Module              | Responsibility                                                                    |
| ------------------- | --------------------------------------------------------------------------------- |
| Landing Page        | Hero section, feature bento grid, testimonials, and call-to-action                |
| Auth (Login)        | Email/password login with validation, error display, and redirect                 |
| Auth (Register)     | Multi-step registration with email verification and onboarding preferences        |
| Job Search          | Search, filter by work type, location, experience level, and sort results         |
| Job Detail          | Full job description, requirements, skills, salary, and apply link                |
| AI CV Analyzer      | Upload CV, select target job roles, run analysis, and view structured results     |
| CV Analysis Results | Score displays, section reviews, action points, and job recommendations           |
| Profile             | View and edit user profile, skills, experience, education, and profile photo      |
| Saved Jobs          | Browse, manage, and remove bookmarked jobs                                        |
| Application Tracker | Track applications by status, update status, add notes, and view status history   |
| CV Analysis History | Browse past CV analysis results with filters and pagination                       |

## Tech Stack

| Area              | Choice                                  |
| ----------------- | --------------------------------------- |
| Framework         | Next.js `16.2.4` (App Router)           |
| Language          | TypeScript `5`                          |
| UI Library        | React `19.2.4`                          |
| Styling           | Tailwind CSS `4` with CSS custom props  |
| Animations        | Framer Motion `12`                      |
| Icons             | Lucide React                            |
| Forms             | React Hook Form `7`                     |
| Class Utilities   | clsx, tailwind-merge                    |
| Font              | Geist, Geist Mono (via `next/font`)     |
| Linting           | ESLint `9` with `eslint-config-next`    |
| Package Manager   | npm                                     |

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application runs at:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Environment Configuration

The frontend communicates with the Backend API through a local Next.js route handler proxy at `/api/bisakerja/[...path]`. This proxy forwards requests server-side to the real backend, avoiding CORS restrictions.

Important configuration:

- The Backend API base URL must be configured in the proxy route handler (`app/api/bisakerja/[...path]/route.ts`).
- Remote image domains are configured in `next.config.ts` for `images.unsplash.com` and `avatars.githubusercontent.com`.
- Environment variables for the backend connection should be set as needed for the proxy configuration.

Do not commit real API keys, backend URLs, or production secrets.

## Available Scripts

| Script          | Purpose                                     |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start the development server with Turbopack |
| `npm run build` | Build the production bundle                 |
| `npm run start` | Start the production server                 |
| `npm run lint`  | Run ESLint                                  |

## Project Structure

```text
.
├── app/
│   ├── layout.tsx                    # Root layout with fonts, metadata, AuthProvider
│   ├── page.tsx                      # Landing page (hero, features, testimonials)
│   ├── globals.css                   # Global styles, CSS custom properties, Tailwind
│   ├── favicon.ico
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   ├── jobs/
│   │   ├── page.tsx                  # Job search and listing page
│   │   └── [id]/
│   │       └── page.tsx              # Job detail page
│   ├── ai-cv-analyzer/
│   │   └── page.tsx                  # AI CV Analyzer page
│   ├── profile/
│   │   ├── page.tsx                  # User profile page
│   │   ├── saved-jobs/               # Saved jobs (bookmarks) sub-page
│   │   ├── application-tracker/      # Application tracker sub-page
│   │   ├── cv-analyze-history/       # CV analysis history sub-page
│   │   └── _components/              # Profile-specific components
│   └── api/
│       ├── bisakerja/
│       │   └── [...path]/            # Catch-all proxy to Backend API
│       └── wilayah/                   # Indonesian region data proxy
├── components/
│   ├── Navbar.tsx                    # Main navigation bar
│   ├── Footer.tsx                    # Site footer
│   ├── JobCard.tsx                   # Job listing card component
│   ├── CVResultPage.tsx              # CV analysis result display
│   ├── login.tsx                     # Login form component
│   ├── register.tsx                  # Registration form component
│   ├── blocks/
│   │   └── features.tsx              # Feature showcase block (bento grid)
│   └── ui/
│       ├── card.tsx                  # Card component
│       ├── container-scroll-animation.tsx  # Scroll-based animation
│       ├── demo.tsx                  # Demo/showcase component
│       └── testimonials-columns-1.tsx # Testimonials display
├── lib/
│   ├── api.ts                        # API client, types, and fetch wrapper
│   ├── auth.tsx                      # AuthContext provider and hooks
│   └── utils.ts                      # Utility functions (cn helper)
├── public/
│   ├── assets/
│   │   ├── logo.svg                  # Bisakerja logo
│   │   └── banner/                   # Banner images
│   ├── company-logo/                 # Company logo assets
│   ├── maskots/                      # Mascot illustrations
│   ├── screenshots/                  # App screenshots and recordings
│   └── templates/                    # Template assets
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint configuration
├── postcss.config.mjs                # PostCSS configuration
└── package.json
```

## Key Components

### Authentication Flow

Authentication is managed through a React Context provider (`lib/auth.tsx`) that wraps the entire application via the root layout. The auth system:

- Stores access tokens and user data in `localStorage`
- Provides `useAuth()` hook for components to access auth state
- Handles login, registration, logout, and token refresh
- Supports email verification and password reset flows

### API Client

The centralized API client (`lib/api.ts`) provides:

- Type-safe request/response interfaces for all Backend API endpoints
- A generic `apiFetch` wrapper that handles token injection, error parsing, and response typing
- Custom `APIError` class with structured error codes and status
- All API calls route through the Next.js proxy at `/api/bisakerja/` to avoid CORS

### Landing Page

The landing page (`app/page.tsx`) features:

- Dark-themed hero section with gradient background and grid overlay
- Container scroll animation for product demo
- Bento grid layout showcasing platform features with mouse-tracking hover effects
- Testimonials section with animated columns
- Call-to-action sections for registration

### CV Analyzer

The AI CV Analyzer workflow (`app/ai-cv-analyzer/page.tsx`) supports:

- PDF file upload with drag-and-drop
- Job role selection for targeted analysis
- Multi-step loading animation during analysis
- Structured result display via `CVResultPage` component with scores, section reviews, action points, and job recommendations

## API Integration

All API communication flows through a single path:

```text
Frontend Component → lib/api.ts → /api/bisakerja/[...path] (Next.js proxy) → Backend API
```

The proxy pattern (`app/api/bisakerja/[...path]/route.ts`) forwards all HTTP methods (GET, POST, PATCH, PUT, DELETE) server-side to the Backend API, attaching cookies and headers transparently.

Key API modules consumed:

| Module         | Endpoint Prefix           | Operations                                          |
| -------------- | ------------------------- | --------------------------------------------------- |
| Auth           | `/auth`                   | Register, login, logout, refresh, verify email      |
| Profile        | `/me`                     | Fetch/update profile, skills, experience, education |
| Preferences    | `/me/preferences`         | Upsert career preferences                           |
| Jobs           | `/jobs`                   | Search, filter, sort, get detail                    |
| Bookmarks      | `/me/bookmarks`           | List, create, delete saved jobs                     |
| Applications   | `/me/applications`        | List, create, update status                         |
| CV Files       | `/me/cv-files`            | Upload, get active CV file                          |
| CV Analyzer    | `/ai/cv-analyzer`         | Run analysis, list history, get result detail       |

## Styling & Design System

The application uses Tailwind CSS v4 with a custom design token system defined in `globals.css`:

- **Color tokens**: CSS custom properties (`--primary`, `--secondary`, `--muted`, etc.) mapped through Tailwind's `@theme` directive
- **Typography**: Geist and Geist Mono fonts loaded via `next/font`
- **Dark theme**: Hero and feature sections use dark backgrounds with gradient overlays and grid patterns
- **Animations**: Framer Motion for page transitions and interactive elements; CSS keyframes for loading spinners
- **Bento grid**: Custom CSS component with mouse-tracking hover glow effects
- **Responsive**: Mobile-first approach with breakpoints at `md` (768px)

## Deployment Notes

The application is a standard Next.js application that can be deployed to:

- **Vercel**: Zero-configuration deployment (recommended for Next.js)
- **Self-hosted**: Build with `npm run build`, then serve with `npm run start`
- **Docker**: Containerize using a multi-stage Dockerfile with Node.js

Deployment expectations:

- Ensure the Backend API URL is configured in the proxy route handler for the target environment.
- Set appropriate environment variables for any deployment-specific configuration.
- The application requires the Backend API to be running and accessible from the deployment environment.
- Remote image domains (`images.unsplash.com`, `avatars.githubusercontent.com`) must remain configured in `next.config.ts` or updated to match production needs.
- Use the production build (`npm run build` + `npm run start`) for performance; do not serve the development server in production.

## Contribution Guide

Before changing behavior:

- Understand the relevant feature module and its interaction with the Backend API.
- Keep component boundaries clean: pages in `app/`, shared components in `components/`, utilities in `lib/`.
- Ensure all API types in `lib/api.ts` stay synchronized with the Backend API contracts.
- Update or add components for any new UI features rather than embedding complex logic in pages.
- Test responsive behavior across mobile and desktop breakpoints.
- Run lint checks before committing:

```bash
npm run lint
```

- Do not introduce direct calls to Scraper API or Model API from the frontend.
- Keep authentication logic centralized in `lib/auth.tsx` and `lib/api.ts`.
- When adding new routes, ensure they are properly linked in the Navbar component.
- When modifying API types, verify compatibility with the Backend API's response envelope format (`success`, `message`, `data`, `meta`, `error`).
