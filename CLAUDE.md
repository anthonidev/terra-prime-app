# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Terra Prime App is a Next.js 16 application for real estate sales management, built with modern architecture. This is a fresh rebuild (v0.1.0) focused on sales, leads, collections (cobranza), and project management for a Spanish-speaking user base.

**Primary Language**: Spanish (UI, types, variables)
**Runtime**: Bun (use `bun` commands, not `npm`)
**Branch Strategy**: Development on `ultimate` branch, PRs to `master`

## Development Commands

```bash
# Development
bun dev                    # Start dev server at http://localhost:3000
bun run tsc --noEmit      # Type-check without emitting files

# Production
bun build                  # Build for production
bun start                  # Run production build

# Code Quality
eslint                     # Run linter (note: "bun lint" runs just "eslint")

# Component Management
npx shadcn@latest add [component]    # Add shadcn/ui components
```

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
# .env
NEXT_PUBLIC_API_BACKENDL_URL=http://localhost:5000  # Client-side accessible
API_BACKENDL_URL=http://localhost:5000              # Server-side only
JWT_SECRET=your-jwt-secret-key
```

## Architecture: Feature-Based Structure

### Critical Principle: Everything is Feature-Based

This project follows a **feature-based architecture** where each feature is a self-contained module with all its dependencies.

### Folder Structure

```
├── app/                    # App Router - ONLY routes and layouts
│   ├── (auth)/            # Route group - Authentication
│   ├── (dashboard)/       # Route group - Dashboard
│   └── api/               # API Routes (use only when necessary)
│
├── features/              # 🎯 FEATURE-BASED ARCHITECTURE
│   ├── users/
│   │   ├── components/           # React components (Client or Server)
│   │   ├── hooks/                # Custom hooks (always client-side)
│   │   ├── lib/                  # Business logic (server-safe)
│   │   │   ├── queries.ts        # Read operations
│   │   │   ├── mutations.ts      # Write operations
│   │   │   ├── validation.ts     # Zod schemas
│   │   │   └── utils.ts          # Feature-specific utilities
│   │   ├── actions/              # Server Actions
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts          # ONLY index.ts allowed for types
│   │   └── constants/            # Constants
│   │       └── index.ts          # ONLY index.ts allowed for constants
│   │
│   ├── sales/            # Sales management (ventas)
│   ├── leads/            # Lead management
│   ├── projects/         # Project and lot management
│   ├── auth/             # Authentication
│   └── [other features]
│
├── components/            # Shadcn/ui components (managed by shadcn CLI)
│   └── ui/               # UI components from shadcn/ui
│
├── shared/                # Code shared between 3+ features
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   ├── data-table/           # Reusable table components
│   │   └── common/               # Common components
│   ├── hooks/                    # Shared hooks
│   ├── lib/                      # Shared utilities
│   │   ├── utils.ts              # cn(), formatters
│   │   ├── api-client.ts         # Axios config with interceptors
│   │   └── query-client.ts       # React Query config
│   ├── providers/                # React providers
│   ├── types/                    # Shared types
│   └── utils/                    # Utility functions
│       └── currency-formatter.ts # Currency formatting (PEN/USD)
```

## Critical Architecture Rules

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

// 2. Next.js specific
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 3. UI Components (from components/ui)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Shared utilities and hooks
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { useDebounce } from '@/shared/hooks/use-debounce';

// 5. Other features
import { UserCard } from '@/features/users/components/user-card';

// 6. Current feature (relative imports)
import { useUsers } from '../hooks/use-users';
import type { User } from '../types';
```

### 3. Component Separation: Server vs Client

**Server Components (Default - Preferred)**
```typescript
// NO 'use client' directive
import { getUsers } from '../lib/queries';

export async function UserList() {
  const users = await getUsers(); // Direct server-side fetch
  return <div>{/* render */}</div>;
}
```

**Client Components (Only When Necessary)**
```typescript
'use client';

import { useState } from 'react';
import { useUsers } from '../hooks/use-users';

export function UserTable() {
  const [filter, setFilter] = useState('');
  const { data } = useUsers();
  return <div>{/* interactive UI */}</div>;
}
```

Use Client Components for:
- Interactivity (useState, useEffect, event handlers)
- React hooks
- Browser APIs (localStorage, window)
- Libraries requiring client-side (framer-motion, react-hook-form)

### 4. Loading States with loading.tsx

**ALWAYS create a `loading.tsx` file alongside your `page.tsx`** to provide instant loading feedback during navigation.

```typescript
// app/(dashboard)/users/loading.tsx
import { UsersSkeleton } from '@/features/users/components/users-skeleton';

export default function Loading() {
  return <UsersSkeleton />;
}
```

Create skeleton components in your feature folder: `components/[feature-name]-skeleton.tsx`

### 5. Authentication & Server Components Limitation

⚠️ **IMPORTANT: Server Components cannot access localStorage**

Our `apiClient` uses `localStorage` for JWT tokens, which means **authenticated requests cannot be made from Server Components**.

**Current Solution: Use Client Components with React Query**

```typescript
// ✅ CORRECT - Client Component with React Query
'use client';

export function ProfileContainer() {
  const { data, isLoading } = useProfile();
  if (isLoading) return <ProfileSkeleton />;
  return <ProfileDisplay data={data} />;
}

// ❌ WRONG - Server Component cannot access token
export default async function ProfilePage() {
  const data = await getProfile(); // This will fail - no token in server
  return <ProfileDisplay data={data} />;
}
```

## State Management with TanStack Query

### Queries Pattern

```typescript
// features/users/lib/queries.ts
import { apiClient } from '@/shared/lib/api-client';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get('/users');
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
import type { CreateUserInput } from '../types';

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
});

// Infer types from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### React Hook Form with Zod

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput } from '../lib/validation';

export function UserForm() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    mutate(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
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
```

## API Client Configuration

The API client is configured in `src/shared/lib/api-client.ts` with:

- **Automatic token injection** from localStorage
- **Token refresh** on 401 errors
- **Request/response interceptors**
- **Relative URLs in browser** (uses Next.js proxy to avoid CORS)
- **Full URLs on server-side**

```typescript
// Usage in mutations/queries
import { apiClient } from '@/shared/lib/api-client';

const response = await apiClient.get('/api/users');
const response = await apiClient.post('/api/users', data);

// For FormData (file uploads)
const formData = new FormData();
formData.append('file', file);
const response = await apiClient.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Responsive Design Patterns

### Desktop Table + Mobile Cards

For data-heavy features (sales, leads, payments), use this pattern:

```typescript
{/* Desktop: Table */}
<div className="hidden md:block">
  <DataTable columns={columns} data={data} />
</div>

{/* Mobile: Cards */}
<div className="md:hidden">
  <CardView data={data} />
</div>
```

Create skeleton components for each view.

## Currency Formatting

Always use the shared currency formatter for PEN/USD:

```typescript
import { formatCurrency } from '@/shared/utils/currency-formatter';

// Basic usage
formatCurrency(1234.56, 'PEN'); // "S/ 1,234.56"
formatCurrency(1234.56, 'USD'); // "$ 1,234.56"

// Without decimals
formatCurrency(1234, 'PEN', { showDecimals: false }); // "S/ 1,234"

// Without symbol
formatCurrency(1234.56, 'PEN', { showSymbol: false }); // "1,234.56"
```

## Multi-Step Forms Pattern

For complex flows (like sales creation), break into steps:

```typescript
// 1. Create hook for form state management
// features/sales/hooks/use-sales-form.ts
export function useSalesForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SalesFormData>({
    step1: {},
    step2: {},
    step3: {},
  });

  return { currentStep, formData, setFormData, nextStep, prevStep };
}

// 2. Create step components
// features/sales/components/steps/sales-step-1.tsx
'use client';

export function SalesStep1({ data, onNext, onBack }) {
  const form = useForm({ defaultValues: data });
  return <form onSubmit={form.handleSubmit(onNext)}>{/* fields */}</form>;
}

// 3. Use stepper component
import { Stepper } from '@/shared/components/common/stepper';
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
```

### Suspense and Streaming

```typescript
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
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

## Modals and Dialogs

Use shadcn Dialog component with proper state management:

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function MyModal({ open, onOpenChange, data }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        {/* Content */}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Role-Based Access Control

User roles are stored in the auth context:

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';

export function MyComponent() {
  const { user } = useAuth();

  // Check role code
  const canEdit = user?.role.code === 'VEN'; // Vendor role

  return canEdit ? <EditButton /> : null;
}
```

Common role codes:
- `VEN`: Vendor (can register payments)
- `ADM`: Admin
- Add others as discovered in the codebase

## Animation Patterns with Framer Motion

Use consistent animation patterns:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Entrance animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* content */}
</motion.div>

// Stagger animations (lists)
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    {/* item */}
  </motion.div>
))}

// Exit animations
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

## Pre-Commit Checklist

Before committing:
- [ ] `bun run tsc --noEmit` passes (0 errors)
- [ ] Are imports direct (no barrel files except types/constants)?
- [ ] Do Server Components avoid unnecessary `'use client'`?
- [ ] Are validations using Zod?
- [ ] Are types defined?
- [ ] No console.logs left behind?
- [ ] Do React Query queries have unique keys?
- [ ] Do forms use react-hook-form with zodResolver?
- [ ] Does every page with data fetching have a `loading.tsx` file?
- [ ] Does every feature have a skeleton component?

## Git Workflow

- **Development branch**: `ultimate`
- **Main branch**: `master`
- **Commit flow**: Work on `ultimate` → Create PR to `master`
- Use descriptive commit messages in Spanish or English
