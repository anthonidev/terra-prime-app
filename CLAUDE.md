# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs with Turbopack for faster development)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format code**: `npm run format`
- **Check formatting**: `npm run format:check`

## Project Architecture

This is a Next.js 15 real estate management application for "Terra Prime" built with a clean architecture pattern.

### Core Architecture Layers

The application follows a layered architecture pattern organized in `src/lib/`:

1. **Domain Layer** (`src/lib/domain/`):
   - Entities: Core business objects (payments, sales, users, projects, etc.)
   - Repositories: Abstract interfaces for data access

2. **Application Layer** (`src/lib/application/`):
   - DTOs: Data transfer objects for API communication
   - Use Cases: Business logic implementation

3. **Infrastructure Layer** (`src/lib/infrastructure/`):
   - API repositories: HTTP implementations of domain repositories
   - Server actions: Next.js server actions that connect use cases to the UI
   - Types: TypeScript type definitions for API responses

### Key Business Domains

- **Sales Management**: Lead assignment, sales tracking, payment processing
- **Collection Management**: Payment tracking, client assignments, supervisor oversight
- **Project Management**: Real estate project and lot management
- **User Management**: Authentication, roles, profile management
- **Chatbot**: Customer support chat system

### Authentication & Authorization

- Uses NextAuth.js with custom credentials provider
- JWT-based authentication with token refresh
- Role-based access control through middleware
- Protected routes via `src/middleware.ts`

### UI Framework

- Tailwind CSS for styling
- Radix UI components with shadcn/ui
- React Hook Form for form management
- Zod for validation
- Framer Motion for animations

### Path Aliases

The project uses TypeScript path aliases defined in `tsconfig.json`:
- `@/*`: `./src/*`
- `@components/*`: `./src/components/*`
- `@ui/*`: `./src/components/ui/*`
- `@domain/*`: `./src/lib/domain/*`
- `@infrastructure/*`: `./src/lib/infrastructure/*`
- `@application/*`: `./src/lib/application/*`

### Key Environment Variables

Required environment variables:
- `API_BACKENDL_URL`: Backend API URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `JWT_SECRET`: JWT signing secret

### Directory Structure Notes

- **App Router**: Uses Next.js 13+ app directory structure
- **Dashboard Layout**: Main application routes under `(dashboard)` folder
- **Feature Organization**: Each business domain has its own folder with components, hooks, and pages
- **Shared Components**: Common UI components in `src/components/`
- **Server Actions**: Located in `src/lib/infrastructure/server-actions/`