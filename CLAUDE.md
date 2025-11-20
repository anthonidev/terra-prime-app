# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Terra Prime App is a Next.js 16 real estate management application for handling leads, projects, sales, payments, participants, and user management. Built with TypeScript, React Query, React Hook Form, Zod validation, and Tailwind CSS.

## Development Commands

```bash
# Development server (opens http://localhost:3000)
bun dev

# Production build
bun run build

# Start production server
bun start

# Run linter
bun run lint

# Type checking
bun run tsc --noEmit

# Format code (applies formatting to all files)
bun run format

# Check if code is formatted (without modifying files)
bun run format:check

# Check for unused dependencies
bun run check-deps

# Install dependencies
bun install

# Prepare git hooks (runs automatically after install)
bun run prepare
```

## Architecture

### Feature-Based Module Structure

The codebase uses a feature-based architecture where each feature is self-contained in `src/features/[feature-name]/`:

```
src/features/[feature-name]/
├── types/index.ts          # TypeScript interfaces and types
├── lib/
│   ├── mutations.ts        # API mutation functions (POST/PUT/DELETE)
│   ├── queries.ts          # API query functions (GET)
│   └── validation.ts       # Zod validation schemas
├── hooks/                  # Custom React hooks (use-[feature].ts)
└── components/             # Feature-specific UI components
    ├── containers/         # Smart components with business logic
    ├── forms/              # Form components with react-hook-form
    ├── tables/             # Data tables with React Table
    ├── dialogs/            # Modal dialogs
    ├── displays/           # Presentational components
    ├── filters/            # Filter UI components
    └── skeletons/          # Loading state components
```

**Key Features:**

- `auth/` - Authentication (login, password reset, session management)
- `leads/` - Lead management and assignment
- `sales/` - Sales tracking and management
- `payments/` - Payment processing and approval
- `projects/` - Project and property management
- `users/` - User administration
- `participants/` - Participant/client management
- `vendors/` - Vendor management
- `agents/` - Agent management
- `layout/` - Sidebar, navbar, and navigation components

### Path Aliases

```typescript
@/*           → src/*
@/features/*  → src/features/*
@/shared/*    → src/shared/*
```

### Shared Resources (`src/shared/`)

- `components/` - Reusable UI components
  - `common/` - PageHeader, EmptyContainer, Stepper
  - `data-table/` - Generic React Table wrapper
  - `confirmation-dialog.tsx` - Reusable confirmation modals
- `hooks/` - Custom hooks
  - `use-confirmation.tsx` - Promise-based confirmation dialog hook
  - `use-media-query.ts` - Responsive design hook
- `lib/`
  - `api-client.ts` - Axios instance with interceptors
  - `query-client.ts` - React Query configuration
  - `utils.ts` - Common utilities (cn, formatters)
- `providers/` - QueryProvider, ThemeProvider
- `types/` - Shared TypeScript types

### UI Components (`src/components/ui/`)

shadcn/ui components built on Radix UI primitives. These are auto-generated via the shadcn CLI and should not be manually edited unless necessary.

## API and Data Fetching

### Axios Client (`src/shared/lib/api-client.ts`)

- **Client-side**: Uses relative URLs through Next.js proxy (avoids CORS)
- **Server-side**: Uses full backend URL from `API_BACKENDL_URL` env variable
- **Request interceptor**: Automatically adds Bearer token from localStorage
- **Response interceptor**: Handles 401 errors with automatic token refresh using refresh token queue

### React Query (`src/shared/lib/query-client.ts`)

Configuration:

- `staleTime`: 60 seconds
- `refetchOnWindowFocus`: false
- `retry`: 1 for queries, 0 for mutations

### Standard Pattern

```typescript
// 1. Define API function in lib/mutations.ts or lib/queries.ts
export async function getLeads(params: LeadParams) {
  const response = await apiClient.get('/api/leads', { params });
  return response.data;
}

// 2. Create custom hook in hooks/use-leads.ts
export function useLeads(params: LeadParams) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => getLeads(params),
    staleTime: 2 * 60 * 1000,
  });
}

// 3. Use in component
const { data, isLoading, error } = useLeads({ page: 1, limit: 20 });
```

### Mutation Pattern with Cache Invalidation

```typescript
export function useDeleteSale() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ saleId, data }) => deleteSale(saleId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success(data.message);
      router.push('/ventas');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
```

## Authentication

Uses better-auth with localStorage-based token storage.

### Key Files

- `src/features/auth/hooks/use-auth.ts` - Auth state hook
- `src/features/auth/hooks/use-login.ts` - Login mutation hook
- `src/features/auth/components/guards/protected-route.tsx` - Route protection
- `src/features/auth/lib/mutations.ts` - Auth API calls

### Flow

1. User logs in → tokens stored in localStorage (accessToken, refreshToken, user)
2. `apiClient` automatically includes Bearer token in all requests
3. On 401 error → automatic token refresh via refresh token
4. On refresh failure → clear storage and redirect to `/auth/login`

### Protected Routes

All routes in `src/app/(dashboard)/` are protected via the `<ProtectedRoute>` guard in the layout.

## Forms and Validation

### Standard Form Pattern

```typescript
// 1. Define Zod schema in lib/validation.ts
export const loginSchema = z.object({
  document: z.string().min(8, 'Document must be at least 8 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 2. Create form component
export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { document: '', password: '' },
  });

  const { mutate: login, isPending } = useLogin();

  return (
    <form onSubmit={form.handleSubmit((data) => login(data))}>
      <div>
        <Label htmlFor="document">Document</Label>
        <Input id="document" {...form.register('document')} />
        {form.formState.errors.document && (
          <p className="text-sm text-destructive">
            {form.formState.errors.document.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Multi-Step Forms

For complex forms (e.g., sales creation), split validation schemas by step:

- `step1Schema`, `step2Schema`, `step3DirectPaymentSchema`, `step3FinancedSchema`
- Use container hooks to manage step state and form data aggregation
- Validate each step independently before allowing navigation

## Component Patterns

### Container + Hook Pattern

Separate business logic from presentation:

```typescript
// Container (presentation)
export function MySalesContainer() {
  const { sales, isLoading, isEmpty, toggleOrder } = useMySalesContainer();

  if (isLoading) return <Skeleton />;
  if (isEmpty) return <EmptyContainer />;

  return <SalesTable data={sales} onToggleOrder={toggleOrder} />;
}

// Hook (business logic)
export function useMySalesContainer() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useMySales({ page, limit: 20, order });

  const toggleOrder = () => setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  const isEmpty = !isLoading && data?.items.length === 0;

  return { sales: data?.items, isLoading, isEmpty, toggleOrder };
}
```

### Component Organization

- **Containers**: Smart components with hooks and logic
- **Forms**: Form UI with react-hook-form integration
- **Tables**: Data display using @tanstack/react-table
- **Dialogs**: Modal interactions with confirmation logic
- **Displays**: Pure presentational components
- **Filters**: Filter UI with local state
- **Skeletons**: Loading state placeholders
- **Steps**: Multi-step wizard components

## Styling

- **Tailwind CSS 4** with PostCSS
- **className composition**: Use `cn()` utility from `src/shared/lib/utils.ts`

  ```typescript
  import { cn } from '@/shared/lib/utils';

  <div className={cn('base-class', isActive && 'active-class')} />
  ```

- **Dark mode**: Managed via `next-themes` with system preference support
- **Icons**: lucide-react
- **Animations**: framer-motion for transitions
- **Notifications**: sonner for toast messages

## Environment Configuration

### Next.js Config (`next.config.ts`)

- **API Proxy**: `/api/*` → `API_BACKENDL_URL` (default: `http://localhost:5000`)
- **Image Domains**: Cloudinary and S3 (dev + prod buckets)
- **Dev Indicators**: Bottom-right position

### Environment Variables

Create `.env.local`:

```
API_BACKENDL_URL=http://localhost:5000
```

## Adding a New Feature

1. **Create feature folder**: `src/features/[feature-name]/`
2. **Define types**: Create `types/index.ts` with TypeScript interfaces
3. **Add validation**: Create `lib/validation.ts` with Zod schemas
4. **API functions**: Create `lib/queries.ts` and `lib/mutations.ts`
5. **Custom hooks**: Create hooks in `hooks/` directory
6. **Components**: Build UI in `components/` following organization patterns
7. **Page routes**: Add pages in `src/app/(dashboard)/[feature-name]/`
8. **Navigation**: Update `src/features/layout/constants/menu.constants.ts`

## Common Utilities

- `cn()` - Merge Tailwind classes (src/shared/lib/utils.ts)
- `currencyFormatter` - Format currency values
- `useConfirmation()` - Promise-based confirmation dialogs
- `useMediaQuery()` - Responsive breakpoint detection
- `PageHeader` - Consistent page headers with title/actions
- `EmptyContainer` - Empty state displays
- `Stepper` - Multi-step wizard navigation

## Git Hooks and Code Quality

### Pre-commit Hooks (Husky)

This project uses **Husky** to enforce code quality standards before commits. The pre-commit hook automatically runs:

1. **Code formatting with Prettier** (`bun run format:check`)
   - Checks if code is properly formatted
   - Automatically formats code if needed and adds changes to commit
   - Ensures consistent code style across the project
   - Includes Tailwind CSS class sorting

2. **TypeScript type checking** (`bun run tsc --noEmit`)
   - Ensures all code is type-safe
   - Prevents commits with type errors

3. **ESLint linting** (`bun run lint`)
   - Enforces code style and best practices
   - Must pass before commit

4. **Sensitive file detection**
   - Blocks commits containing `.env.local`, `.env.production.local`, `credentials.json`
   - Prevents accidental exposure of secrets

### Hook Configuration

- **Location**: `.husky/pre-commit`
- **Auto-install**: Git hooks are installed automatically when running `bun install` (via `prepare` script)
- **Colored output**: Pre-commit hook displays user-friendly messages with colored indicators (🚀, ✅, ❌)

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hooks (use with caution)
git commit --no-verify -m "Emergency fix"
```

**Note**: Only bypass hooks in emergencies. All code should pass type checking and linting before committing.

### Code Formatting (Prettier)

This project uses **Prettier** for consistent code formatting with the following configuration:

- **Single quotes**: Enforced for strings
- **Semicolons**: Required at end of statements
- **Print width**: 100 characters
- **Tab width**: 2 spaces
- **Trailing commas**: ES5 compatible
- **Arrow function parentheses**: Always included
- **End of line**: LF (Unix-style)
- **Tailwind CSS plugin**: Automatically sorts Tailwind classes in recommended order

#### Configuration Files

- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files/directories to exclude from formatting

#### Usage

```bash
# Format all code files
bun run format

# Check formatting without modifying files
bun run format:check
```

**Important**: Code is automatically formatted during pre-commit. You don't need to run format manually before committing.

#### VS Code Configuration

The project includes VS Code workspace settings (`.vscode/settings.json`) that:

- **Use Prettier as default formatter** for all file types
- **Disable VS Code's organize imports** (Shift+Alt+O) to prevent alphabetical sorting
- **Format on save** enabled automatically
- **ESLint auto-fix** on save
- **Tailwind CSS IntelliSense** configured for `cn()` and `cva()` functions

**Recommended VS Code Extensions** (`.vscode/extensions.json`):

- `esbenp.prettier-vscode` - Prettier formatter
- `dbaeumer.vscode-eslint` - ESLint integration
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
- `ms-vscode.vscode-typescript-next` - TypeScript support

**Key Settings**:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "never" // Prevents alphabetical sorting
  },
  "typescript.preferences.organizeImportsOnFormat": false
}
```

**Note**: If you're still seeing alphabetical import sorting with Shift+Alt+O, make sure:

1. The Prettier VS Code extension is installed
2. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")
3. Check that `.prettierrc` exists in the project root

### Dependency Management (Depcheck)

Use `depcheck` to find unused dependencies and missing dependencies:

```bash
# Check for unused dependencies
bun run check-deps
```

**Common depcheck output**:

- **Unused dependencies**: Dependencies in package.json that aren't imported anywhere
- **Unused devDependencies**: Dev dependencies that aren't used
- **Missing dependencies**: Imported packages not listed in package.json

**Note**: Some false positives may occur with:

- Next.js plugins and configs
- ESLint/Prettier plugins (used via config files)
- Type-only imports
- Dynamically imported dependencies

Review the output carefully before removing dependencies.

## Important Notes

- **Never commit sensitive data**: .env files are gitignored and blocked by pre-commit hooks
- **shadcn/ui updates**: Use `bunx shadcn@latest add [component]` to add new UI components
- **TypeScript strict mode**: All code must pass strict type checking (enforced by pre-commit)
- **Cache invalidation**: Always invalidate React Query cache after mutations
- **Token refresh**: Handled automatically by api-client interceptors
- **Error handling**: Display user-friendly messages via toast notifications
- **Loading states**: Always show loading indicators during async operations
- **Zustand**: Available but not actively used (auth uses localStorage)
- **Pre-commit checks**: All commits are automatically validated for formatting, types, linting, and sensitive files
- **Code formatting**: Use Prettier for all code formatting (automatic in pre-commit)
- **Dependency cleanup**: Periodically run `bun run check-deps` to identify unused dependencies

## Key Dependencies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Static typing
- **@tanstack/react-query** - Server state management
- **@tanstack/react-table** - Data tables
- **axios** - HTTP client
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **better-auth** - Authentication library
- **tailwindcss 4** - Utility-first CSS
- **shadcn/ui** - Radix UI + Tailwind components
- **framer-motion** - Animations
- **sonner** - Toast notifications
- **husky** - Git hooks for code quality enforcement
- **prettier** - Code formatting with Tailwind CSS plugin
- **depcheck** - Unused dependency detection
