# GEMINI Project Context: terra-prime-app

## Project Overview

This is a full-stack web application built with **Next.js 16 (using React 19)** and **TypeScript**. It serves as a real estate management system named "Terra Prime App". The project uses the **Next.js App Router** for routing and follows a **feature-sliced design pattern**, organizing code into `src/features`, `src/components`, and `src/shared` directories.

The frontend is decoupled from a separate backend service. API requests are proxied from `/api/:path*` to a backend service defined by the `API_BACKENDL_URL` environment variable (defaults to `http://localhost:5000`), as configured in `next.config.ts`.

## Key Technologies

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [React](https://react.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) on top of [Radix UI](https://www.radix-ui.com/) and styled with [Tailwind CSS](https://tailwindcss.com/).
- **State Management**:
  - **Server State**: [TanStack Query](https://tanstack.com/query) for data fetching, caching, and synchronization.
  - **Client State**: [Zustand](https://github.com/pmndrs/zustand) for global client-side state.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation.
- **API Client**: [Axios](https://axios-http.com/) with interceptors for robust authentication handling.
- **Linting**: [ESLint](https://eslint.org/) configured for Next.js projects.

## Building and Running the Project

The project uses `bun` as the package manager (though `npm` or `yarn` can also be used). The main scripts are defined in `package.json`.

- **To run the development server:**

  ```bash
  bun dev
  ```

  The application will be available at [http://localhost:3000](http://localhost:3000).

- **To create a production build:**

  ```bash
  bun build
  ```

- **To run the production server:**

  ```bash
  bun start
  ```

- **To run the linter:**
  ```bash
  bun lint
  ```

## Development Conventions

- **Architecture**: The codebase is structured using a feature-sliced approach.
  - `src/app`: Contains the pages and layouts for the Next.js App Router.
  - `src/features`: Contains distinct business features (e.g., `auth`, `projects`, `users`). Each feature folder may contain its own `components`, `hooks`, `lib`, and `types`.
  - `src/components`: Contains reusable, general-purpose UI components, primarily from `shadcn/ui`.
  - `src/shared`: Contains code shared across the entire application, such as the `api-client`, `providers`, and base `hooks`.
- **Authentication**: The application uses JWT (JSON Web Tokens) for authentication. The `api-client.ts` (`src/shared/lib/api-client.ts`) is configured with Axios interceptors to automatically:
  1.  Attach the `accessToken` from `localStorage` to outgoing requests.
  2.  Handle `401 Unauthorized` errors by attempting to refresh the token using the `refreshToken`.
  3.  Queue and retry requests that failed due to token expiration.
  4.  Redirect to the login page (`/auth/login`) if the refresh token is invalid or missing.
- **Styling**: The project uses **Tailwind CSS**. Utility classes are the primary way of styling components. A global stylesheet is located at `src/styles/globals.css`.
- **Environment**: The backend API URL is configured via the `API_BACKENDL_URL` environment variable. For local development, this defaults to `http://localhost:5000`.
