# ThriveMidlife: Mind-Body Reset for Women

## Overview

ThriveMidlife is a comprehensive wellness application designed specifically for women navigating perimenopause and midlife transitions. The app combines health assessment tools, journaling capabilities, coaching programs, and progress tracking to provide a holistic approach to mental, physical, and cognitive well-being.

The application follows a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database, all built with TypeScript for type safety and maintainability.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom wellness-themed color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: Local storage with custom hooks for data persistence
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for CRUD operations
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Express sessions with PostgreSQL store

### Database Layer
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Structured tables for users, assessments, journal entries, goals, habits, and progress tracking
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Health Assessment System
Three specialized calculators that provide scored insights:
- **Mental Health Calculator**: PHQ-9 and GAD-7 based assessments for mood, anxiety, and sleep
- **Physical Health Calculator**: Perimenopause symptom tracking including energy, hormonal changes, and vitality
- **Cognitive Health Calculator**: Memory, focus, and mental clarity assessments

Each calculator generates a 0-100 score with personalized recommendations and tracks progress over time.

### Coaching Program
A structured 6-week "Mind Reset Method" program featuring:
- Weekly modules with video content, exercises, and reflections
- CBT and NLP-based therapeutic techniques
- Progress tracking with completion states
- Interactive components including worksheets and audio content

### Journaling System
Daily reflection tools with:
- Guided prompts based on current coaching week
- Mood tracking with 5-point emotional scale
- Auto-save functionality for draft preservation
- Historical entry browsing and search capabilities

### Goal and Habit Tracking
Personal development tools including:
- SMART goal setting with categories (sleep, mindfulness, exercise, self-care)
- Daily habit tracking with streak counters
- Progress visualization and milestone celebrations

### Meditation and Mindfulness Tools
Integrated wellness features:
- Breathing exercise timer with 4-7-8 pattern
- Guided meditation sessions
- 5-4-3-2-1 grounding technique
- Audio content with playback controls

## Data Flow

1. **User Interaction**: Frontend components capture user input through forms and interactive elements
2. **Client-Side Processing**: React components update local state and trigger API calls
3. **API Layer**: Express routes validate requests using Zod schemas
4. **Database Operations**: Drizzle ORM handles type-safe database queries
5. **Response Processing**: API responses are cached by TanStack Query for optimal performance
6. **UI Updates**: Components re-render based on updated data state

Local storage serves as the primary data persistence layer for demo purposes, with full database integration available through the established schema and API endpoints.

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem (React DOM, React Router via Wouter)
- Express.js with middleware for JSON parsing and CORS
- TypeScript for compile-time type checking

### Database and ORM
- @neondatabase/serverless for PostgreSQL connection
- Drizzle ORM for database operations
- connect-pg-simple for session storage

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- Chart.js for data visualization

### Development Tools
- Vite for fast development builds and HMR
- ESBuild for production bundling
- TSX for TypeScript execution in development

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Concurrent frontend and backend development
- Real-time error overlay for debugging

### Production Build Process
1. Frontend assets compiled with Vite to `dist/public`
2. Backend TypeScript compiled with ESBuild to `dist/index.js`
3. Database migrations applied via Drizzle Kit
4. Environment variables configured for production database

### Runtime Configuration
- Node.js server serves both API endpoints and static frontend assets
- PostgreSQL database connection via environment variable
- Session management with secure cookies
- CORS configured for production domain

The application is designed for easy deployment to platforms like Vercel, Netlify, or traditional VPS hosting with minimal configuration changes.

## Changelog
- July 04, 2025. Completed Week 3 "Emotion Regulation & Boundaries" with fully comprehensive interactive components
- July 04, 2025. Completed Week 2 "Thought Rewiring with CBT Reframing Techniques" with 4 fully interactive components
- July 04, 2025. Implemented comprehensive Hormone Harmony Meditation with tab-based navigation and interactive meditation phases
- July 01, 2025. Initial setup

## Recent Progress
- ✓ Week 2 CBT Reframing module fully implemented and tested (4 components)
- ✓ Week 3 Emotion Regulation & Boundaries restored with comprehensive interactive components (4 components):
  - Overwhelm Pattern Analysis (5-step comprehensive assessment)
  - Pause-Label-Shift Technique (neuroscience-backed emotion regulation)
  - Boundaries Worksheet (personalized boundary scripts)
  - Weekly Mood Map (emotional pattern tracking)
- ✓ Hormone Harmony Meditation component completed with independent section access
- ✓ All interactive functionality verified and working
- → Week 3 components preserved and ready for testing

## User Preferences

Preferred communication style: Simple, everyday language.