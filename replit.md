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

PostgreSQL database serves as the primary data persistence layer with production-ready authentication-based access control. All user data is securely stored with proper foreign key relationships and type-safe operations through Drizzle ORM.

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

## SEO Optimization Features
- ✓ Comprehensive Meta Tags: Page-specific titles, descriptions, keywords, and Open Graph tags
- ✓ Structured Data: JSON-LD schema markup for business, course, and service information
- ✓ Dynamic SEO Management: React hooks for updating meta tags per page
- ✓ XML Sitemap Generation: Automated sitemap.xml with proper priorities and update frequencies
- ✓ Robots.txt: Search engine crawling directives for optimal indexing
- ✓ Social Media Optimization: Facebook and Twitter card meta tags for enhanced sharing
- ✓ Canonical URLs: Duplicate content prevention with proper canonical link tags
- ✓ Professional SEO Architecture: Complete technical SEO foundation for search visibility

## Marketing Funnel Features
- ✓ Lead Capture System: Professional landing page with email opt-in and lead magnet delivery
- ✓ Welcome Email Sequence: 5-email automated nurture sequence with educational content and soft sales
- ✓ Lead Management Database: Complete lead tracking with source attribution and conversion events
- ✓ Email Marketing Automation: SendGrid integration with professional templates and scheduling
- ✓ Conversion Tracking: Full funnel analytics from landing page views to coaching plan purchases
- ✓ Funnel Analytics Dashboard: Admin interface showing conversion rates, email performance, and revenue metrics
- ✓ Professional Email Templates: Welcome, nurture, educational, and sales email sequences
- ✓ Lead Scoring and Segmentation: Behavioral tracking and automated follow-up based on engagement

## Advanced Marketing Features (EXCELLENT)
- ✓ Advanced Lead Scoring: Dynamic 0-100 point system based on behavioral engagement patterns
- ✓ Behavioral Event Tracking: Real-time monitoring of page views, clicks, form submissions, video watches
- ✓ A/B Testing Framework: Complete testing infrastructure with variant assignment and conversion tracking
- ✓ Enhanced Lead Segmentation: Automatic audience categorization based on source, score, and behavior
- ✓ UTM Campaign Tracking: Complete attribution tracking from source to conversion with campaign data
- ✓ Session-Based Analytics: Detailed user journey mapping with session persistence and exit tracking
- ✓ Client-Side Behavior Library: Comprehensive JavaScript tracking for all user interactions
- ✓ Advanced Analytics Dashboard: Lead scores, high-intent prospects, and behavioral insights
- ✓ Scroll Depth Monitoring: Engagement measurement with 25% increment tracking milestones
- ✓ Time-on-Page Analytics: Detailed engagement metrics with page exit event tracking

## Video Infrastructure Features (NEW)
- ✓ Complete Video Upload System: Admin interface for uploading, organizing, and managing video content
- ✓ Professional Video Player: Full-featured player with controls, progress tracking, and streaming support
- ✓ Database Integration: Video metadata storage with module and week organization capabilities  
- ✓ Admin Video Management: Upload, edit metadata, preview, and organize videos by coaching weeks/modules
- ✓ Future Integration Ready: Infrastructure prepared for adding videos to specific coaching components when content is ready
- ✓ File Validation & Security: Upload restrictions, file size limits, and authenticated access controls
- ✓ Streaming Support: Optimized video delivery with range request support for smooth playback

## Personal Coaching Contact System Features (NEW)
- ✓ Professional Contact Form: Comprehensive coaching inquiry form with detailed fields for goals, challenges, experience, and scheduling preferences
- ✓ Automated Email Notifications: Instant notification to Dr. Sidra with formatted inquiry details and 24-hour response commitment  
- ✓ Client Confirmation Emails: Professional welcome sequence explaining next steps and discovery call process
- ✓ Database Integration: Complete coaching inquiry storage with status tracking and admin management capabilities
- ✓ Mobile-Responsive Design: Beautiful gradient styling with professional layout optimized for all devices
- ✓ Navigation Integration: Prominent "Personal Coaching" call-to-action button in header for easy access
- ✓ Email Templates: Branded email communications with Dr. Sidra's credentials and ThriveMidlife branding
- ✓ Admin Dashboard Ready: Backend endpoint prepared for coaching inquiry management and status updates

## Professional Footer Features (NEW)
- ✓ Comprehensive Footer Layout: Professional multi-column footer with brand information, quick links, and contact details
- ✓ Dr. Sidra Credentials Display: Medical qualifications and specializations prominently featured (Psychiatrist, NLP Coach, Mindfulness Trainer, Gynecologist)
- ✓ Complete Navigation Links: All major sections accessible from footer including coaching, community, progress tracking, and about page
- ✓ Contact Information Hub: Multiple contact methods including general, coaching, and technical support email addresses
- ✓ Social Media Integration: Ready-to-configure social media links for Facebook, Instagram, LinkedIn, and Twitter
- ✓ Legal Compliance: Privacy policy, terms of service, medical disclaimer, and accessibility links
- ✓ Professional Branding: ThriveMidlife logo with light variant support and tagline "Mind-Body Reset"
- ✓ Medical Disclaimer: Comprehensive legal disclaimer regarding medical advice and professional relationship clarification

## Professional Email Signature System (NEW)
- ✓ Four Signature Variants: Personal coaching, automated system, support team, and newsletter marketing signatures
- ✓ Professional Email Signature Page: Complete preview and copy interface with HTML export functionality
- ✓ Dr. Sidra Personal Signature: Professional format featuring medical credentials, contact information, and confidentiality notice
- ✓ Automated Email Integration: System emails now include appropriate professional signatures based on context
- ✓ Email Client Instructions: Step-by-step setup guides for Gmail, Outlook, Apple Mail, and Thunderbird
- ✓ Copy & Download Features: One-click copying to clipboard and HTML file downloads for easy setup
- ✓ Branded Design Elements: ThriveMidlife colors, gradients, and professional styling throughout all signatures
- ✓ Contact Information Consistency: Unified contact details across all signature variations for brand consistency

## Changelog
- July 05, 2025. COMPLETED PROFESSIONAL EMAIL SIGNATURE SYSTEM - Built comprehensive email signature collection with four variants (personal, system, support, newsletter), preview interface, copy/download functionality, and email client setup instructions
- July 05, 2025. COMPLETED PROFESSIONAL FOOTER - Added comprehensive footer with Dr. Sidra's credentials, navigation links, contact information, social media integration, and legal compliance
- July 05, 2025. COMPLETED PERSONAL COACHING CONTACT SYSTEM - Built comprehensive coaching inquiry form with email automation and database integration for Dr. Sidra's 1:1 and group coaching services
- July 05, 2025. COMPLETED VIDEO INFRASTRUCTURE - Built complete video upload and management system for future admin use while preserving all existing coaching content
- July 05, 2025. COMPLETED VIDEO/AUDIO REMOVAL - Replaced all video and audio content with interactive, detailed, and engaging exercises throughout the coaching program
- July 05, 2025. COMPLETED EXCELLENT MARKETING FUNNEL ENHANCEMENTS - Advanced lead scoring (0-100), behavioral tracking, A/B testing framework, UTM campaign tracking, session analytics, scroll depth monitoring, and time-on-page metrics
- July 05, 2025. COMPLETED FULL MARKETING FUNNEL with lead capture, nurture sequences, and conversion tracking
- July 05, 2025. COMPLETED COMPREHENSIVE SEO OPTIMIZATION for search engine visibility and social sharing
- July 04, 2025. COMPLETED EMAIL INTEGRATION with SendGrid for professional user communications
- July 04, 2025. COMPLETED DATABASE MIGRATION TO POSTGRESQL with authentication integration
- July 04, 2025. COMPLETED Week 6 "Future Self & Goal Mapping" with all 4 comprehensive interactive components - PROTECTED
- July 04, 2025. COMPLETED Week 5 "Clarity & Cognitive Flow" with all 4 comprehensive interactive components - PROTECTED
- July 04, 2025. COMPLETED Week 4 "Nervous System Reset" with all 4 comprehensive interactive components - PROTECTED
- July 04, 2025. COMPLETED Week 3 "Emotion Regulation & Boundaries" with fully comprehensive interactive components - PROTECTED
- July 04, 2025. COMPLETED Week 2 "Thought Rewiring with CBT Reframing Techniques" with 4 fully interactive components - PROTECTED
- July 04, 2025. Implemented comprehensive Hormone Harmony Meditation with tab-based navigation and interactive meditation phases
- July 01, 2025. Initial setup

## Email Integration Features
- ✓ Welcome Email System: Automated welcome emails sent to new users upon first login
- ✓ Payment Confirmation Emails: Professional payment receipts sent after successful coaching plan purchases
- ✓ Weekly Reminder System: Framework for sending coaching progress reminders (admin endpoint ready)
- ✓ Professional Email Templates: Welcome, payment confirmation, and weekly reminder templates with branded styling
- ✓ SendGrid Integration: Complete email service integration with error handling and retry logic
- ✓ Test Email Endpoint: Admin testing capability for all email types with customizable recipients

## Recent Progress
- ✓ Enhanced Preview Mode & Payment System (July 04, 2025):
  - Complete program preview showing all 6 weeks and 24 components before purchase
  - Stripe payment integration for coaching plan access ($97 one-time payment, originally $297)
  - Health Assessment dashboard remains completely FREE for all users
  - Enhanced component descriptions with "Interactive" badges and transformation messaging
  - Social proof elements and urgency messaging throughout preview experience
  - Professional purple-themed styling for locked components with lock icons
  - Multiple strategic call-to-action buttons directing to secure checkout
  - Payment protection with compelling visual design and savings emphasis
  - Demo access button for testing full program functionality
  - LocalStorage-based access tracking for seamless user experience
- ✓ Dr. Sidra Bukhari Professional Introduction (July 04, 2025):
  - Comprehensive "About Dr. Sidra Bukhari" section showcasing dual medical expertise (Psychiatrist + Gynecologist)
  - Professional credentials highlighting NLP Life Coach, Mindfulness Trainer, and CBT specialization
  - Compelling personal story emphasizing hundreds of clients served across medical specialties
  - Four expertise areas with evidence-based approach to women's midlife wellness
  - Dedicated About page with professional philosophy and transformational mission
  - Integration in dashboard and navigation for prominent professional presence
- ✓ Professional Brand Identity Implementation (July 04, 2025):
  - Custom SVG logo design with wellness symbolism (three petals representing mental, physical, cognitive health)
  - Dynamic color gradients matching application theme
  - Multiple size variants (sm, md, lg, xl) and display options (full, icon, text)
  - Integrated in navigation header with hover effects
  - Prominent display on dashboard welcome section with gentle animation
  - Professional brand consistency across the entire application
- ✓ Enhanced Wellness Trends Visualization with Chart.js:
  - Interactive bar and line chart options with dynamic switching
  - Color-coded progression tracking (Green, Blue, Yellow, Orange, Red based on scores)
  - 5-week historical progression simulation leading to current wellness scores
  - Professional tooltips with performance categories and exact values
  - Responsive design with smooth animations and gradient styling
- ✓ Week 6 "Future Self & Goal Mapping" FULLY COMPLETED and PROTECTED (4 components):
  - Future Self Visualization & Values Mapping (4-step comprehensive values discovery with life wheel assessment and vision implementation planning)
  - SMART Goal Architecture System (4-step evidence-based goal framework with obstacle anticipation and action planning)  
  - Reverse Engineering Success Method (4-step strategic backward planning with milestone mapping and resource identification)
  - Habit Loop Mastery System (4-step neuroscience-based habit formation with cue-routine-reward loops and tracking systems)
- ✓ Week 5 "Clarity & Cognitive Flow" FULLY COMPLETED and PROTECTED (4 components):
  - Enhanced Cognitive Clarity Assessment (4-step comprehensive cognitive baseline with real-time scoring and personalized recommendations)
  - Focus & Memory Rituals (9 evidence-based techniques: Memory Palace, Spaced Repetition, Enhanced Pomodoro with scientific explanations)
  - Brain-Boosting Nutrition Plan (6 brain food categories, 12 meal templates, 4 supplement protocols with cognitive impact analysis)
  - Mind Management System (6 evidence-based techniques for cognitive load management with implementation planning)
- ✓ Week 4 "Nervous System Reset" FULLY COMPLETED and PROTECTED (4 components):
  - Somatic Grounding Practices (6-step comprehensive nervous system assessment and techniques)
  - Breathwork & Vagus Nerve Reset (6-step breathing mastery with interactive timer and vagus health scoring)
  - Create Your Calm Corner (5-step sanctuary design with color psychology and sensory guidance)
  - Guided Grounding Meditation (5-step meditation with real-time timer, phase tracking, and benefits analysis)
- ✓ Week 3 "Emotion Regulation & Boundaries" COMPLETED and PROTECTED (4 components):
  - Overwhelm Pattern Analysis (5-step comprehensive assessment)
  - Pause-Label-Shift Technique (neuroscience-backed emotion regulation)  
  - Boundaries Worksheet (7-step interactive boundary scripts for all life areas)
  - Weekly Mood Map (4-step comprehensive emotional tracking with daily analytics)
- ✓ Week 2 "Thought Rewiring with CBT Reframing Techniques" COMPLETED and PROTECTED (4 components)
- ✓ ALL WEEKS 2, 3, 4, 5, AND 6 COMPONENTS VERIFIED, APPROVED, AND PERMANENTLY PRESERVED
- ✓ COMPLETE 6-WEEK COACHING PROGRAM IMPLEMENTATION FINISHED - 24 TOTAL COMPONENTS FULLY FUNCTIONAL

## User Preferences

Preferred communication style: Simple, everyday language.

## PROTECTED WEEKS - DO NOT MODIFY
**WEEKS 3, 4, 5, AND 6 ARE PERMANENTLY SAVED AND PROTECTED**
- Week 3 "Emotion Regulation & Boundaries" - LOCKED
- Week 4 "Nervous System Reset" - LOCKED  
- Week 5 "Clarity & Cognitive Flow" - LOCKED
- Week 6 "Future Self & Goal Mapping" - LOCKED

These 16 components (4 per week) are complete and must not be changed under any circumstances. User has explicitly requested these weeks remain exactly as implemented.