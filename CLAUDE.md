# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Terra Prime App is a Next.js 16 application being rebuilt/remastered with modern architecture. This is currently a fresh rebuild (v0.1.0) with the foundation being established. The git history shows this replaces a larger application with extensive features around sales, leads, collections (cobranza), and project management.

**Primary Language**: Spanish (Spanish-speaking user base)
**Runtime**: Bun (use `bun` commands, not `npm`)
**Branch Strategy**: Development on `ultimate` branch, PRs to `master`

## Technology Stack

### Core
- **Framework**: Next.js 16.0.1 with App Router
- **React**: 19.2.0 (React Server Components)
- **TypeScript**: 5 (strict mode enabled)
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: Shadcn/ui (new-york style) with Radix UI primitives

### State Management & Data Fetching
- **Server State**: @tanstack/react-query ^5.90.5
- **Client State**: React hooks (useState, useReducer)
- **HTTP Client**: Axios ^1.13.1

### Forms & Validation
- **Forms**: react-hook-form ^7.65.0
- **Validation**: zod ^4.1.12
- **Form Validation**: @hookform/resolvers ^5.2.2

### UI & Utilities
- **Tables**: @tanstack/react-table ^8.21.3
- **Icons**: lucide-react ^0.548.0
- **Charts**: recharts ^3.3.0 (use with dynamic imports)
- **Animations**: framer-motion ^12.23.24
- **Dates**: date-fns ^4.1.0 + date-fns-tz ^3.2.0
- **Toasts**: sonner ^2.0.7
- **Theming**: next-themes ^0.4.6
- **Styling Utils**: clsx, tailwind-merge, class-variance-authority

### Environment Variables
```bash
# .env.local
API_BACKENDL_URL=https://api.example.com
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_API_BACKENDL_URL=https://api.example.com  # Client-side accessible
```

## Development Commands

```bash
# Development
bun dev                    # Start dev server at http://localhost:3000

# Production
bun build                  # Build for production
bun start                  # Run production build

# Code Quality
eslint                     # Run linter (note: "bun lint" runs just "eslint")

# Component Management
npx shadcn@latest add [component]    # Add shadcn/ui components
```

## Architecture: Feature-Based Structure

### Critical Principle: Everything is Feature-Based

This project follows a **feature-based architecture** where each feature is a self-contained module with all its dependencies.

### Folder Structure

```
├── app/                    # App Router - ONLY routes and layouts
│   ├── (auth)/            # Route group - Authentication
│   │   ├── layout.tsx
│   │   └── login/page.tsx
│   ├── (dashboard)/       # Route group - Dashboard
│   │   ├── layout.tsx
│   │   └── users/
│   │       ├── _components/      # Local components (underscore = not a route)
│   │       ├── _lib/             # Local utilities
│   │       └── page.tsx
│   ├── api/               # API Routes (use only when necessary)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── error.tsx          # Error boundary
│   ├── not-found.tsx      # 404 page
│   └── loading.tsx        # Loading UI
│
├── features/              # 🎯 FEATURE-BASED ARCHITECTURE
│   ├── users/
│   │   ├── components/           # React components (Client or Server)
│   │   │   ├── user-table.tsx
│   │   │   ├── user-form.tsx
│   │   │   └── user-card.tsx
│   │   ├── hooks/                # Custom hooks (always client-side)
│   │   │   ├── use-users.ts
│   │   │   ├── use-user.ts
│   │   │   ├── use-create-user.ts
│   │   │   ├── use-update-user.ts
│   │   │   └── use-delete-user.ts
│   │   ├── lib/                  # Business logic (server-safe)
│   │   │   ├── queries.ts        # Read operations
│   │   │   ├── mutations.ts      # Write operations
│   │   │   ├── validation.ts     # Zod schemas
│   │   │   └── utils.ts          # Feature-specific utilities
│   │   ├── actions/              # Server Actions
│   │   │   ├── create-user.ts
│   │   │   ├── update-user.ts
│   │   │   └── delete-user.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts          # ONLY index.ts allowed for types
│   │   └── constants/            # Constants
│   │       └── index.ts          # ONLY index.ts allowed for constants
│   │
│   ├── dashboard/
│   ├── reports/
│   └── notifications/
│
├── components/            # Shadcn/ui components (managed by shadcn CLI)
│   └── ui/               # UI components from shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── ...
│
├── shared/                # Code shared between 3+ features
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── navigation.tsx
│   │   ├── data-table/           # Reusable table components
│   │   └── common/               # Common components
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   ├── hooks/                    # Shared hooks
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   └── use-local-storage.ts
│   ├── lib/                      # Shared utilities
│   │   ├── utils.ts              # cn(), formatters
│   │   ├── api-client.ts         # Axios config
│   │   ├── query-client.ts       # React Query config
│   │   └── date-utils.ts         # date-fns helpers
│   ├── providers/                # React providers
│   │   └── query-provider.tsx    # TanStack Query provider
│   ├── types/                    # Shared types
│   │   ├── api.ts
│   │   └── common.ts
│   └── constants/                # Shared constants
│       ├── routes.ts
│       └── config.ts
│
├── config/
│   ├── site.ts
│   └── env.ts
```

## Critical Rules for Feature-Based Architecture

### 1. NO Barrel Files (index.ts) ❌

**NEVER use barrel files except for `types/` and `constants/`**

```typescript
// ✅ CORRECT - Direct imports
import { UserCard } from '@/features/users/components/user-card';
import { useUsers } from '@/features/users/hooks/use-users';
import { createUser } from '@/features/users/actions/create-user';

// ❌ WRONG - Barrel file
import { UserCard, useUsers } from '@/features/users';

// ✅ EXCEPTION - Only for types and constants
import type { User, UserRole } from '@/features/users/types';
import { USER_ROLES } from '@/features/users/constants';
```

### 2. Import Pattern (Consistent Order)

```typescript
// 1. External libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';

// 2. Next.js specific
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 3. UI Components (from components/ui)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Shared utilities and hooks
import { cn } from '@/shared/lib/utils';
import { useDebounce } from '@/shared/hooks/use-debounce';

// 5. Other features
import { UserCard } from '@/features/users/components/user-card';

// 6. Current feature (relative imports)
import { useUsers } from '../hooks/use-users';
import type { User } from '../types';

// 7. Styles (if applicable)
import './styles.css';
```

### 3. When to Use `shared/` vs `features/`

```typescript
// ✅ Use components/ui/ for:
// - Shadcn/ui components (managed by shadcn CLI)
// - Base UI primitives from Radix UI
// - Always import from @/components/ui/*
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ✅ Use shared/ when:
// - Used in 3+ features
// - Generic and reusable
// - No specific business logic
// - Layout components, data tables, custom hooks
import { Header } from '@/shared/components/layout/header';
import { DataTable } from '@/shared/components/data-table';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';

// ✅ Use features/ when:
// - Specific to a domain
// - Contains business logic
// - Used in 1-2 features maximum
import { UserCard } from '@/features/users/components/user-card';
import { validateUserRole } from '@/features/users/lib/validation';
```

### 4. Colocation in app/ for Page-Specific Code

```typescript
// If a component is ONLY used in ONE specific page:
app/
  (dashboard)/
    users/
      _components/          # Underscore = NOT a route
        user-filters.tsx
      _lib/
        utils.ts
      page.tsx              # Uses _components/user-filters.tsx
```

## Naming Conventions

```typescript
// COMPONENTS - PascalCase
UserCard.tsx
LoginForm.tsx
DashboardLayout.tsx

// HOOKS - use + PascalCase
use-users.ts        // File name
useUsers            // Function name

// SERVER ACTIONS - camelCase (verbs)
create-user.ts      // File name
createUser          // Function name

// LIB/UTILS - camelCase
queries.ts
mutations.ts
validation.ts
utils.ts

// TYPES - PascalCase
User
UserRole
CreateUserInput
ApiResponse

// CONSTANTS - UPPER_SNAKE_CASE
USER_ROLES
API_BASE_URL
DEFAULT_PAGE_SIZE

// ROUTE GROUPS - (name) lowercase with dashes
(auth)
(dashboard)
(admin)
```

## Component Patterns

### Server Components (Default - Preferred)

```typescript
// features/users/components/user-list.tsx
// NO 'use client' directive

import { getUsers } from '../lib/queries';
import { UserCard } from './user-card';

export async function UserList() {
  const users = await getUsers(); // Direct server-side fetch

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**Use Server Components for:**
- Data fetching
- Direct backend/database access
- Static content rendering
- SEO-critical pages

### Client Components (Only When Necessary)

```typescript
// features/users/components/user-form.tsx
'use client';

import { useState } from 'react';
import { useCreateUser } from '../hooks/use-create-user';
import { Button } from '@/shared/components/ui/button';

export function UserForm() {
  const [name, setName] = useState('');
  const { mutate, isPending } = useCreateUser();

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutate({ name }); }}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <Button disabled={isPending}>Create</Button>
    </form>
  );
}
```

**Use Client Components for:**
- Interactivity (useState, useEffect, event handlers)
- React hooks
- Browser APIs (localStorage, window)
- Libraries requiring client-side (framer-motion, react-hook-form)

### Server + Client Composition

```typescript
// app/(dashboard)/users/page.tsx - Server Component
import { getUsers } from '@/features/users/lib/queries';
import { UserTable } from '@/features/users/components/user-table';

export default async function UsersPage() {
  const users = await getUsers(); // Server-side fetch

  return (
    <div>
      <h1>Users</h1>
      <UserTable users={users} /> {/* Pass data to client component */}
    </div>
  );
}

// features/users/components/user-table.tsx - Client Component
'use client';

import { useState } from 'react';
import type { User } from '../types';

interface Props {
  users: User[]; // Receives data from server component
}

export function UserTable({ users }: Props) {
  const [filter, setFilter] = useState('');
  const filteredUsers = users.filter(u => u.name.includes(filter));

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {/* Render filteredUsers */}
    </div>
  );
}
```

### Loading States with loading.tsx

Next.js 16 provides `loading.tsx` as a special file that automatically wraps your page in a Suspense boundary, showing a loading UI during navigation and initial data fetching.

#### Pattern for Features with Skeleton Components

**ALWAYS create a `loading.tsx` file alongside your `page.tsx`** to provide instant loading feedback during navigation.

```typescript
// app/(dashboard)/users/loading.tsx
import { UsersSkeleton } from '@/features/users/components/users-skeleton';

export default function Loading() {
  return <UsersSkeleton />;
}
```

**Create skeleton components in your feature folder:**

```typescript
// features/users/components/users-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function UsersSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" /> {/* Title */}
        <Skeleton className="h-5 w-96 mt-2" /> {/* Description */}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
```

#### When to Use loading.tsx

✅ **ALWAYS use loading.tsx for:**
- Any page that fetches data (Server or Client Components)
- Provides instant feedback during navigation
- Better UX than blank screen while loading
- Works with both Server Components and Client Components with React Query

#### Loading States Flow

**For Client Components with React Query:**

```typescript
// app/(dashboard)/profile/loading.tsx
import { ProfileSkeleton } from '@/features/profile/components/profile-skeleton';

export default function Loading() {
  return <ProfileSkeleton />;
}

// app/(dashboard)/profile/page.tsx
import { ProfileContainer } from '@/features/profile/components/profile-container';

export default function ProfilePage() {
  return <ProfileContainer />;
}

// features/profile/components/profile-container.tsx
'use client';

import { useProfile } from '../hooks/use-profile';
import { ProfileSkeleton } from './profile-skeleton';

export function ProfileContainer() {
  const { data, isLoading, isError } = useProfile();

  // Show skeleton during client-side fetch
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data?.data) {
    return <ErrorState />;
  }

  return <ProfileDisplay data={data.data} />;
}
```

**Flow:**
1. User navigates → `loading.tsx` shows `ProfileSkeleton` (instant)
2. Page component mounts → `ProfileContainer` starts fetching
3. While fetching → Shows `ProfileSkeleton` again (same component)
4. Data arrives → Renders actual content

**Benefits:**
- ✅ Instant feedback during navigation
- ✅ Consistent skeleton during fetch
- ✅ Works with mutations and refetch (via `invalidateQueries`)
- ✅ No flash of blank content

### Authentication & Server Components Limitation

⚠️ **IMPORTANT: Server Components cannot access localStorage**

Our current `apiClient` uses `localStorage` for JWT tokens, which means **authenticated requests cannot be made from Server Components**.

```typescript
// shared/lib/api-client.ts
// ❌ This won't work in Server Components
const token = typeof window !== 'undefined'
  ? localStorage.getItem('accessToken')
  : null;
```

**Current Solution: Use Client Components with React Query**

For authenticated routes (dashboard, profile, etc.), use Client Components with React Query:

```typescript
// ✅ CORRECT - Client Component with React Query
// app/(dashboard)/profile/page.tsx
import { ProfileContainer } from '@/features/profile/components/profile-container';

export default function ProfilePage() {
  return <ProfileContainer />; // Client Component handles auth
}

// ❌ WRONG - Server Component cannot access token
export default async function ProfilePage() {
  const data = await getProfile(); // This will fail - no token in server
  return <ProfileDisplay data={data} />;
}
```

**Future Improvements (if needed):**

To enable Server Components for authenticated requests:

1. **Use cookies instead of localStorage**
   ```typescript
   // middleware.ts
   import { cookies } from 'next/headers';

   const token = cookies().get('accessToken')?.value;
   ```

2. **Server Actions with cookies**
   ```typescript
   'use server';

   import { cookies } from 'next/headers';

   export async function getProfile() {
     const token = cookies().get('accessToken')?.value;
     // Make authenticated request
   }
   ```

3. **Middleware-based auth**
   - Handle token refresh in middleware
   - Pass user data via headers/context

**For now, stick with Client Components + React Query for all authenticated data fetching.**

## State Management with TanStack Query

### Setup Query Client

```typescript
// shared/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

// app/layout.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/query-client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Queries Pattern

```typescript
// features/users/lib/queries.ts
import { apiClient } from '@/shared/lib/api-client';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get('/users');
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
}

// features/users/hooks/use-users.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../lib/queries';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Mutations Pattern

```typescript
// features/users/lib/mutations.ts
import { apiClient } from '@/shared/lib/api-client';
import type { CreateUserInput, UpdateUserInput } from '../types';

export async function createUser(data: CreateUserInput) {
  const response = await apiClient.post('/users', data);
  return response.data;
}

// features/users/hooks/use-create-user.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../lib/mutations';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create user');
      console.error('Error creating user:', error);
    },
  });
}
```

## Validation with Zod

### Define Schemas

```typescript
// features/users/lib/validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin', 'superadmin']),
  document: z.string().min(8, 'Document must be at least 8 characters'),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});

// Infer types from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

### Server Actions with Validation

```typescript
// features/users/actions/create-user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema } from '../lib/validation';
import { apiClient } from '@/shared/lib/api-client';

export async function createUser(input: unknown) {
  // 1. Validate input
  const result = createUserSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 2. Call backend
  try {
    const response = await apiClient.post('/users', result.data);

    // 3. Revalidate cache
    revalidatePath('/users');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create user',
    };
  }
}
```

### React Hook Form with Zod

```typescript
// features/users/components/user-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput } from '../lib/validation';
import { useCreateUser } from '../hooks/use-create-user';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function UserForm() {
  const { mutate, isPending } = useCreateUser();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'user',
      document: '',
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...form.register('email')} placeholder="Email" type="email" />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
}
```

## API Client Configuration

```typescript
// shared/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKENDL_URL || process.env.API_BACKENDL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or refresh token
      console.error('Unauthorized');
    }

    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export { apiClient };
```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  );
}
```

## Performance Optimization

### Dynamic Imports for Heavy Components

```typescript
// For recharts (heavy library)
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(
  () => import('@/features/dashboard/components/revenue-chart'),
  {
    loading: () => <div>Loading chart...</div>,
    ssr: false, // Only client-side if using browser APIs
  }
);

// For framer-motion animations
const AnimatedComponent = dynamic(
  () => import('./animated-component'),
  { ssr: false }
);
```

### Suspense and Streaming

```typescript
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react';
import { StatsCards } from '@/features/dashboard/components/stats-cards';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<div>Loading activity...</div>}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

## Useful Shared Utilities

### cn() - Tailwind Class Merger

```typescript
// shared/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
import { cn } from '@/shared/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  'override-classes'
)} />
```

### Date Utilities

```typescript
// shared/lib/date-utils.ts
import { format, formatDistance, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date, formatStr: string = 'PP') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatRelativeDate(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: es
  });
}
```

### Debounce Hook

```typescript
// shared/hooks/use-debounce.ts
'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

## Pre-Commit Checklist

### Before Creating a Feature
- [ ] Is the feature self-contained?
- [ ] Does the folder structure follow the standard?
- [ ] Are names consistent with conventions?
- [ ] Should it really be a feature or go in `shared/`?

### Before Committing
- [ ] Are imports direct (no barrel files except types/constants)?
- [ ] Do Server Components avoid unnecessary `'use client'`?
- [ ] Are validations using Zod?
- [ ] Are errors handled correctly?
- [ ] Are types defined?
- [ ] No console.logs left behind?
- [ ] Do React Query queries have unique keys?
- [ ] Do forms use react-hook-form with zodResolver?
- [ ] Does every page with data fetching have a `loading.tsx` file?
- [ ] Does every feature have a skeleton component?

### Before Creating a PR
- [ ] Is the code formatted?
- [ ] No circular dependencies?
- [ ] Do heavy components use dynamic imports?
- [ ] Do images use next/image?
- [ ] Do toasts use sonner?

## Critical Rules Summary

1. ❌ **NO barrel files (index.ts)** except for types/ and constants/
2. ✅ **Direct and explicit imports always**
3. ✅ **Shadcn/ui components ALWAYS in @/components/ui/** - NEVER move to shared/
4. ✅ **Server Components by default**, `'use client'` only when necessary
5. ✅ **Validation with Zod** on server and client
6. ✅ **react-hook-form + zodResolver** for all forms
7. ✅ **TanStack Query** for server state (queries and mutations)
8. ✅ **Axios** for HTTP requests
9. ✅ **Features are self-contained** - everything in one folder
10. ✅ **shared/** only for code used in 3+ features (NOT for shadcn/ui components)
11. ✅ **Consistent naming conventions**
12. ✅ **Error handling** at all levels with try-catch and toast
13. ✅ **sonner** for notifications
14. ✅ **date-fns** for date handling
15. ✅ **framer-motion** for animations (with dynamic import if heavy)
16. ✅ **recharts** for charts (always with dynamic import)
17. ✅ **ALWAYS create `loading.tsx`** alongside `page.tsx` for pages with data fetching
18. ✅ **Every feature needs a skeleton component** in `components/[feature-name]-skeleton.tsx`
19. ⚠️ **Authenticated requests MUST use Client Components** - Server Components cannot access localStorage tokens

## Project Context (Historical)

The git history shows this is a **remaster/rebuild** of a previously extensive application. The original app had:

- **Dashboard system** with multiple modules
- **Cobranza (Collections)** module with client assignments and payment tracking
- **Sales (Ventas)** module with lead management, project lots, and participant tracking
- **Lead management** with sources, liners, and vendor assignments
- **User management** and profile system
- **Project management** with lots and blocks
- **Payment processing** with image uploads and approval workflows
- **Chatbot system** for help and guidance

**Current Status**: Fresh rebuild with authentication foundation. Original modules being rebuilt with modern feature-based architecture.
