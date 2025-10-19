# ThriveMidlife: Mind-Body Reset for Women

## Overview

ThriveMidlife is a comprehensive wellness application for women navigating perimenopause and midlife. It offers health assessment tools, journaling, coaching programs, and progress tracking to support mental, physical, and cognitive well-being. The project aims to provide a holistic solution for midlife women, leveraging a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database, all developed with TypeScript for robustness and maintainability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- **Styling**: Tailwind CSS with a custom wellness-themed color palette.
- **UI Components**: Radix UI primitives and shadcn/ui library for accessible and consistent design.
- **Branding**: Custom SVG logo with wellness symbolism and dynamic color gradients.
- **Responsiveness**: Mobile-responsive design for all features.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, React Hook Form with Zod validation, and TanStack Query for data fetching.
- **Backend**: Node.js with Express.js (TypeScript), RESTful API, Zod for request validation, and Express sessions for user management.
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM for type-safe operations and Drizzle Kit for schema management.
- **Key Features**:
    - **Health Assessment System**: Three calculators (Mental, Physical, Cognitive) providing scored insights and personalized recommendations.
    - **Coaching Program**: A structured 6-week "Mind Reset Method" with modules, exercises, reflections, and progress tracking, including CBT and NLP techniques. Weeks 2, 3, 4, 5, and 6 are fully implemented and protected from modifications.
    - **Journaling System**: Daily reflection tools with guided prompts, mood tracking, and historical entry browsing.
    - **Goal and Habit Tracking**: SMART goal setting and daily habit tracking with progress visualization.
    - **Meditation and Mindfulness**: Breathing exercises, guided meditations, and grounding techniques.
    - **Video Infrastructure**: System for uploading, organizing, and managing video content for coaching modules.
    - **Personal Coaching Contact System**: Inquiry form with automated notifications, client confirmations, and database storage.
    - **Professional Footer**: Multi-column footer with Dr. Sidra's credentials, navigation, contact info, social media, and legal links.
    - **Email Signature System**: Four signature variants with preview, copy, and download functionalities.
    - **Marketing Funnel**: Lead capture, welcome sequences, lead management, email marketing automation (SendGrid), and conversion tracking.
    - **Advanced Marketing Features**: Lead scoring, behavioral event tracking, A/B testing, enhanced segmentation, UTM tracking, session-based analytics, and advanced dashboards.
    - **SEO Optimization**: Comprehensive meta tags, structured data, dynamic SEO management, XML sitemap, robots.txt, social media optimization, and canonical URLs.

### System Design Choices
- **Data Flow**: Frontend captures input, React updates state and triggers API calls, Express validates requests, Drizzle ORM handles database operations, TanStack Query caches responses, and components re-render.
- **Authentication**: Production-ready authentication-based access control for secure user data.
- **Development & Deployment**: Vite for development, ESBuild for production, Drizzle Kit for migrations, and environment variable configuration for scalable deployment.

## External Dependencies

- **Frameworks & Libraries**:
    - React 18
    - Express.js
    - TypeScript
    - Tailwind CSS
    - Radix UI
    - shadcn/ui
    - Wouter
    - React Hook Form
    - Zod
    - TanStack Query
    - Lucide React
    - Chart.js
- **Database & ORM**:
    - PostgreSQL (@neondatabase/serverless)
    - Drizzle ORM
    - connect-pg-simple
- **Development Tools**:
    - Vite
    - ESBuild
    - TSX
- **Email Service**:
    - SendGrid