🏗️ Arquitectura y Convenciones del Proyecto Next.js 16
📋 Tabla de Contenidos

Stack Tecnológico
Estructura de Carpetas
Arquitectura Feature-Based
Reglas de Importación
Convenciones de Código
Patrones de Componentes
Gestión de Estado
Validación de Datos
API y Fetching de Datos
Manejo de Errores
Performance

Stack Tecnológico
Core

Framework: Next.js 16 (App Router)
Language: TypeScript (strict mode)
React: 19.2.0
Styling: Tailwind CSS
UI Components: shadcn/ui (basado en Radix UI)

State Management & Data Fetching

Server State: @tanstack/react-query ^5.90.5
Client State: React hooks (useState, useReducer)
HTTP Client: axios ^1.13.1

Forms & Validation

Forms: react-hook-form ^7.65.0
Validation: zod ^4.1.12
Form Validation: @hookform/resolvers ^5.2.2

UI & Utilities

Tables: @tanstack/react-table ^8.21.3
Icons: lucide-react ^0.548.0
Charts: recharts ^3.3.0
Animations: framer-motion ^12.23.24
Dates: date-fns ^4.1.0 + date-fns-tz ^3.2.0
Toasts: sonner ^2.0.7
Theming: next-themes ^0.4.6
Styling Utils:

clsx ^2.1.1
tailwind-merge ^3.3.1
class-variance-authority ^0.7.1

Variables de Entorno
bash# .env.local
API_BACKENDL_URL=https://api.example.com
JWT_SECRET=your-jwt-secret-key

```

---

## Estructura de Carpetas
```

├── app/ # App Router - Solo rutas y layouts
│ ├── (auth)/ # Route group - Autenticación
│ │ ├── layout.tsx
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── register/
│ │ └── page.tsx
│ │
│ ├── (dashboard)/ # Route group - Dashboard
│ │ ├── layout.tsx
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── users/
│ │ │ ├── page.tsx
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ └── reports/
│ │ └── page.tsx
│ │
│ ├── (admin)/ # Route group - Admin
│ │ ├── layout.tsx
│ │ └── admin/
│ │ ├── users/
│ │ │ └── page.tsx
│ │ └── settings/
│ │ └── page.tsx
│ │
│ ├── api/ # API Routes (usar solo cuando sea necesario)
│ │ └── health/
│ │ └── route.ts
│ │
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── error.tsx # Error boundary
│ ├── not-found.tsx # 404 page
│ └── loading.tsx # Loading UI
│
├── features/ # 🎯 Arquitectura Feature-Based
│ ├── users/
│ │ ├── components/
│ │ │ ├── user-table.tsx
│ │ │ ├── user-form.tsx
│ │ │ ├── user-card.tsx
│ │ │ └── user-avatar.tsx
│ │ ├── hooks/
│ │ │ ├── use-users.ts
│ │ │ ├── use-user.ts
│ │ │ ├── use-create-user.ts
│ │ │ ├── use-update-user.ts
│ │ │ └── use-delete-user.ts
│ │ ├── lib/
│ │ │ ├── queries.ts
│ │ │ ├── mutations.ts
│ │ │ ├── validation.ts
│ │ │ └── utils.ts
│ │ ├── actions/
│ │ │ ├── create-user.ts
│ │ │ ├── update-user.ts
│ │ │ └── delete-user.ts
│ │ ├── types/
│ │ │ └── index.ts
│ │ └── constants/
│ │ └── index.ts
│ │
│ ├── dashboard/
│ │ ├── components/
│ │ │ ├── stats-card.tsx
│ │ │ ├── recent-activity.tsx
│ │ │ └── charts/
│ │ │ ├── revenue-chart.tsx
│ │ │ └── user-growth-chart.tsx
│ │ ├── hooks/
│ │ │ └── use-dashboard-stats.ts
│ │ ├── lib/
│ │ │ ├── queries.ts
│ │ │ └── calculations.ts
│ │ └── types/
│ │ └── index.ts
│ │
│ ├── reports/
│ └── notifications/
│
├── shared/ # Código compartido entre features
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ │ ├── button.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── input.tsx
│ │ │ ├── table.tsx
│ │ │ ├── toast.tsx
│ │ │ └── ...
│ │ ├── layout/
│ │ │ ├── header.tsx
│ │ │ ├── sidebar.tsx
│ │ │ ├── footer.tsx
│ │ │ └── navigation.tsx
│ │ ├── data-table/
│ │ │ ├── data-table.tsx
│ │ │ ├── data-table-pagination.tsx
│ │ │ └── data-table-toolbar.tsx
│ │ └── common/
│ │ ├── loading-spinner.tsx
│ │ ├── empty-state.tsx
│ │ └── error-boundary.tsx
│ │
│ ├── hooks/
│ │ ├── use-debounce.ts
│ │ ├── use-media-query.ts
│ │ ├── use-local-storage.ts
│ │ └── use-toast.ts
│ │
│ ├── lib/
│ │ ├── utils.ts # cn(), formatters
│ │ ├── api-client.ts # Axios config
│ │ ├── query-client.ts # React Query config
│ │ └── date-utils.ts # date-fns helpers
│ │
│ ├── types/
│ │ ├── api.ts
│ │ └── common.ts
│ │
│ └── constants/
│ ├── routes.ts
│ └── config.ts
│
├── config/
│ ├── site.ts
│ └── env.ts
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json

```

---

## Arquitectura Feature-Based

### Principios Fundamentales

#### 1. **Un feature = Una carpeta autocontenida**
Cada feature debe contener TODO lo necesario para funcionar de manera independiente.
```

features/
users/ # ✅ Todo relacionado a usuarios
components/
hooks/
lib/
actions/
types/
constants/ 2. NO usar archivos barrel (index.ts)
Importaciones directas para mejor tree-shaking y performance.
typescript// ✅ CORRECTO - Import directo
import { UserCard } from '@/features/users/components/user-card';
import { useUsers } from '@/features/users/hooks/use-users';

// ❌ INCORRECTO - Barrel file
import { UserCard, useUsers } from '@/features/users';
Excepción: Solo para types/ y constants/ si es necesario.
typescript// ✅ Permitido para types
import type { User, UserRole } from '@/features/users/types';
import { USER_ROLES } from '@/features/users/constants';

```

#### 3. **Estructura interna de un feature**
```

features/
[feature-name]/
components/ # Componentes React (Client o Server)
hooks/ # Custom hooks (siempre client-side)
lib/ # Lógica de negocio (server-safe)
actions/ # Server Actions
types/ # TypeScript types (opcional index.ts)
constants/ # Constantes (opcional index.ts)

Reglas de Importación
Regla 1: Patrón consistente de imports
typescript// PATRÓN ESTANDAR
import { ComponentName } from '@/features/[feature]/components/[file]';
import { useHook } from '@/features/[feature]/hooks/[file]';
import { action } from '@/features/[feature]/actions/[file]';
import { util } from '@/features/[feature]/lib/[file]';
import type { Type } from '@/features/[feature]/types';
import { CONSTANT } from '@/features/[feature]/constants';

// EJEMPLOS REALES
import { UserCard } from '@/features/users/components/user-card';
import { useUsers } from '@/features/users/hooks/use-users';
import { createUser } from '@/features/users/actions/create-user';
import { validateUser } from '@/features/users/lib/validation';
import type { User } from '@/features/users/types';
import { USER_ROLES } from '@/features/users/constants';
Regla 2: Dependencias entre features
typescript// ✅ PERMITIDO - Importar de otros features
import { UserCard } from '@/features/users/components/user-card';
import { ReportChart } from '@/features/reports/components/report-chart';

// ⚠️ EVALUAR - Si se importa lib/ de otro feature frecuentemente
// Considera moverlo a shared/lib/
import { validateUser } from '@/features/users/lib/validation';

// ✅ MEJOR - Mover a shared si se usa en 3+ features
import { validateUser } from '@/shared/lib/validation';

// ❌ PROHIBIDO - Dependencias circulares
// features/users -> features/reports
// features/reports -> features/users
Regla 3: shared/ vs features/
typescript// ✅ shared/ - Cuando:
// - Se usa en 3+ features
// - Es genérico y reutilizable
// - No tiene lógica de negocio específica

import { Button } from '@/shared/components/ui/button';
import { DataTable } from '@/shared/components/data-table';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { cn } from '@/shared/lib/utils';

// ✅ features/ - Cuando:
// - Es específico de un dominio
// - Tiene lógica de negocio
// - Se usa en 1-2 features máximo

import { UserCard } from '@/features/users/components/user-card';
import { validateUserRole } from '@/features/users/lib/validation';
Regla 4: Colocation en app/
Si un componente solo se usa en UNA página específica:
typescript// app/(dashboard)/users/\_components/user-filters.tsx
// Solo se usa en app/(dashboard)/users/page.tsx

// ✅ Archivos con \_ no se convierten en rutas
app/
(dashboard)/
users/
\_components/ # Componentes locales a esta ruta
user-filters.tsx
\_lib/ # Utils locales a esta ruta
utils.ts
page.tsx

Convenciones de Código
Naming Conventions
typescript// COMPONENTS - PascalCase
UserCard.tsx
LoginForm.tsx
DashboardLayout.tsx

// HOOKS - use + PascalCase
useUsers.ts
useDebounce.ts
useCreateUser.ts

// SERVER ACTIONS - camelCase (verbos)
createUser.ts
updateUser.ts
deleteUser.ts

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
MAX_FILE_SIZE

// ROUTE GROUPS - (nombre) lowercase con guiones
(auth)
(dashboard)
(admin)
File Organization
typescript// ORDEN DE IMPORTS (de más externo a más interno)
// 1. Librerías externas
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';

// 2. Next.js específico
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 3. Shared
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

// 4. Features (otros)
import { UserCard } from '@/features/users/components/user-card';

// 5. Feature actual (relativo)
import { useUsers } from '../hooks/use-users';
import type { User } from '../types';

// 6. Estilos (si aplica)
import './styles.css';
Exports
typescript// ✅ NAMED EXPORTS (preferido para componentes pequeños)
export function UserCard({ user }: Props) { ... }
export function UserAvatar({ user }: Props) { ... }

// ✅ DEFAULT EXPORT (solo para páginas de Next.js)
// app/(dashboard)/users/page.tsx
export default function UsersPage() { ... }

// ❌ EVITAR - Mezclar default y named en el mismo archivo
export default function UserCard() { ... }
export function UserAvatar() { ... } // Confuso

Patrones de Componentes
Server Components (Por defecto)
typescript// features/users/components/user-list.tsx
// Server Component (sin 'use client')

import { getUsers } from '../lib/queries';
import { UserCard } from './user-card';

export async function UserList() {
const users = await getUsers();

return (
<div>
{users.map(user => (
<UserCard key={user.id} user={user} />
))}
</div>
);
}
Cuándo usar Server Components:

Fetching de datos
Acceso directo a backend/DB
Renderizado de contenido estático
SEO crítico

Client Components
typescript// features/users/components/user-form.tsx
'use client';

import { useState } from 'react';
import { useCreateUser } from '../hooks/use-create-user';
import { Button } from '@/shared/components/ui/button';

export function UserForm() {
const [name, setName] = useState('');
const { mutate, isPending } = useCreateUser();

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
mutate({ name });
};

return (
<form onSubmit={handleSubmit}>
<input
value={name}
onChange={(e) => setName(e.target.value)}
/>
<Button disabled={isPending}>
{isPending ? 'Creating...' : 'Create User'}
</Button>
</form>
);
}
Cuándo usar Client Components:

Interactividad (useState, useEffect, event handlers)
Hooks de React
Browser APIs (localStorage, window, etc)
Librerías que requieren client-side (framer-motion, react-hook-form)

Composición Server + Client
typescript// app/(dashboard)/users/page.tsx
// Server Component
import { getUsers } from '@/features/users/lib/queries';
import { UserTable } from '@/features/users/components/user-table';

export default async function UsersPage() {
const users = await getUsers(); // Fetch en servidor

return (
<div>
<h1>Users</h1>
<UserTable users={users} /> {/_ Client component _/}
</div>
);
}

// features/users/components/user-table.tsx
'use client';

import { useState } from 'react';
import type { User } from '../types';

interface Props {
users: User[]; // Recibe datos del server component
}

export function UserTable({ users }: Props) {
const [filter, setFilter] = useState('');

const filteredUsers = users.filter(u =>
u.name.includes(filter)
);

return (
<div>
<input
value={filter}
onChange={(e) => setFilter(e.target.value)}
/>
{/_ Render filteredUsers _/}
</div>
);
}

Gestión de Estado
Server State (TanStack Query)
typescript// shared/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
defaultOptions: {
queries: {
staleTime: 60 \* 1000, // 1 minuto
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
typescript// features/users/lib/queries.ts
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
staleTime: 5 _ 60 _ 1000, // 5 minutos
});
}

// features/users/hooks/use-user.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/queries';

export function useUser(id: string) {
return useQuery({
queryKey: ['users', id],
queryFn: () => getUser(id),
enabled: !!id,
});
}
Mutations
typescript// features/users/lib/mutations.ts
import { apiClient } from '@/shared/lib/api-client';
import type { CreateUserInput, UpdateUserInput } from '../types';

export async function createUser(data: CreateUserInput) {
const response = await apiClient.post('/users', data);
return response.data;
}

export async function updateUser(id: string, data: UpdateUserInput) {
const response = await apiClient.patch(`/users/${id}`, data);
return response.data;
}

export async function deleteUser(id: string) {
const response = await apiClient.delete(`/users/${id}`);
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

// Uso en componente
'use client';

import { useCreateUser } from '../hooks/use-create-user';
import type { CreateUserInput } from '../types';

export function UserForm() {
const { mutate, isPending, error } = useCreateUser();

const handleSubmit = (data: CreateUserInput) => {
mutate(data);
};

return (
<form onSubmit={handleSubmit}>
{/_ Form fields _/}
{error && <p className="text-red-500">{error.message}</p>}
<button disabled={isPending}>
{isPending ? 'Creating...' : 'Create'}
</button>
</form>
);
}
Client State (React Hooks)
typescript// Para estado local simple
'use client';

import { useState } from 'react';

export function Counter() {
const [count, setCount] = useState(0);

return (
<div>
<p>Count: {count}</p>
<button onClick={() => setCount(count + 1)}>
Increment
</button>
</div>
);
}

// Para estado más complejo
'use client';

import { useReducer } from 'react';

type State = {
step: number;
formData: Record<string, any>;
};

type Action =
| { type: 'NEXT_STEP' }
| { type: 'PREV_STEP' }
| { type: 'UPDATE_FIELD'; field: string; value: any };

function reducer(state: State, action: Action): State {
switch (action.type) {
case 'NEXT_STEP':
return { ...state, step: state.step + 1 };
case 'PREV_STEP':
return { ...state, step: state.step - 1 };
case 'UPDATE_FIELD':
return {
...state,
formData: {
...state.formData,
[action.field]: action.value,
},
};
default:
return state;
}
}

export function MultiStepForm() {
const [state, dispatch] = useReducer(reducer, {
step: 1,
formData: {},
});

// ...
}

Validación de Datos
Schemas con Zod
typescript// features/users/lib/validation.ts
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

// Inferir tipos desde schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
Validación en Server Actions
typescript// features/users/actions/create-user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema } from '../lib/validation';
import { apiClient } from '@/shared/lib/api-client';

export async function createUser(input: unknown) {
// 1. Validar input
const result = createUserSchema.safeParse(input);

if (!result.success) {
return {
success: false,
errors: result.error.flatten().fieldErrors,
};
}

// 2. Llamar al backend
try {
const response = await apiClient.post('/users', result.data);

    // 3. Revalidar cache
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
Validación con React Hook Form
typescript// features/users/components/user-form.tsx
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
<Input
{...form.register('email')}
placeholder="Email"
type="email"
/>
{form.formState.errors.email && (
<p className="text-sm text-red-500 mt-1">
{form.formState.errors.email.message}
</p>
)}
</div>

      <div>
        <Input
          {...form.register('firstName')}
          placeholder="First Name"
        />
        {form.formState.errors.firstName && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>

      {/* Más campos... */}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </Button>
    </form>

);
}

API y Fetching de Datos
API Client con Axios
typescript// shared/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_BACKENDL_URL || process.env.API_BACKENDL_URL,
headers: {
'Content-Type': 'application/json',
},
});

// Request interceptor para agregar el token
apiClient.interceptors.request.use(
(config) => {
// Si necesitas agregar el token desde cookies o localStorage
const token = typeof window !== 'undefined'
? localStorage.getItem('token')
: null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
// Manejar logout o refresh token
console.error('Unauthorized');
}

    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);

}
);

export { apiClient };
Data Fetching Patterns
Server Component (Preferido)
typescript// app/(dashboard)/users/page.tsx
import { getUsers } from '@/features/users/lib/queries';
import { UserTable } from '@/features/users/components/user-table';

export default async function UsersPage() {
const users = await getUsers();

return (
<div>
<h1>Users</h1>
<UserTable users={users} />
</div>
);
}
Client Component con React Query
typescript// features/users/components/user-list-interactive.tsx
'use client';

import { useUsers } from '../hooks/use-users';
import { UserCard } from './user-card';

export function UserListInteractive() {
const { data: users, isLoading, error } = useUsers();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
<div className="grid gap-4">
{users?.map(user => (
<UserCard key={user.id} user={user} />
))}
</div>
);
}
Parallel Data Fetching
typescript// app/(dashboard)/dashboard/page.tsx
import { getUsers } from '@/features/users/lib/queries';
import { getReports } from '@/features/reports/lib/queries';
import { getStats } from '@/features/dashboard/lib/queries';

export default async function DashboardPage() {
// Fetch en paralelo
const [users, reports, stats] = await Promise.all([
getUsers(),
getReports(),
getStats(),
]);

return (
<div>
<StatsCards stats={stats} />
<RecentUsers users={users} />
<RecentReports reports={reports} />
</div>
);
}

Manejo de Errores
Error Boundaries
typescript// app/error.tsx
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

// app/(dashboard)/users/error.tsx
'use client';

export default function UsersError({
error,
reset,
}: {
error: Error;
reset: () => void;
}) {
return (
<div className="flex items-center justify-center min-h-[400px]">
<div className="text-center">
<h2 className="text-xl font-semibold">Failed to load users</h2>
<p className="text-gray-600 mt-2">{error.message}</p>
<button 
          onClick={reset}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
Retry
</button>
</div>
</div>
);
}
Not Found
typescript// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
return (
<div className="flex min-h-screen items-center justify-center">
<div className="text-center">
<h1 className="text-6xl font-bold">404</h1>
<p className="mt-4 text-xl">Page not found</p>
<Link 
          href="/" 
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
Go back home
</Link>
</div>
</div>
);
}
Try-Catch en Server Actions
typescript// features/users/actions/create-user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema } from '../lib/validation';
import { apiClient } from '@/shared/lib/api-client';

export async function createUser(input: unknown) {
try {
// Validación
const data = createUserSchema.parse(input);

    // API call
    const response = await apiClient.post('/users', data);

    revalidatePath('/users');

    return {
      success: true,
      data: response.data,
    };

} catch (error) {
console.error('Error creating user:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    };

}
}
Error Handling con React Query y Sonner
typescript// features/users/hooks/use-create-user.ts
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
toast.error(error.message || 'Failed to create user');
console.error('Mutation error:', error);
},
});
}

Performance
Image Optimization
typescriptimport Image from 'next/image';

// ✅ CORRECTO
<Image
src="/avatar.jpg"
alt="User avatar"
width={100}
height={100}
priority // Solo para above-the-fold images
/>

// Para imágenes externas
<Image
src="https://example.com/avatar.jpg"
alt="User avatar"
width={100}
height={100}
unoptimized={false} // Next.js optimizará
/>
Dynamic Imports
typescript// Para componentes pesados o con dependencias grandes
import dynamic from 'next/dynamic';

// Recharts es pesado, mejor cargarlo dinámicamente
const RevenueChart = dynamic(
() => import('@/features/dashboard/components/revenue-chart'),
{
loading: () => <div>Loading chart...</div>,
ssr: false, // Solo client-side si usa APIs del navegador
}
);

export function Dashboard() {
return (
<div>
<h1>Dashboard</h1>
<RevenueChart />
</div>
);
}

// Para framer-motion (animaciones pesadas)
const AnimatedComponent = dynamic(
() => import('./animated-component'),
{ ssr: false }
);
Suspense y Streaming
typescript// app/(dashboard)/dashboard/page.tsx
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
Memoization
typescript'use client';

import { useMemo } from 'react';
import { useUsers } from '../hooks/use-users';

export function UserStats() {
const { data: users } = useUsers();

// Cálculos costosos memoizados
const stats = useMemo(() => {
if (!users) return null;

    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
    };

}, [users]);

return (
<div>
<p>Total: {stats?.total}</p>
<p>Active: {stats?.active}</p>
<p>Admins: {stats?.admins}</p>
</div>
);
}
Revalidation
typescript// Revalidate on-demand en Server Actions
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateUser(userId: string, data: any) {
// Update user...

// Revalidar rutas específicas
revalidatePath('/users');
revalidatePath(`/users/${userId}`);

// O revalidar por tag
revalidateTag('users');
}

// Usar tags en fetching (Server Components)
const users = await fetch(`${process.env.API_BACKENDL_URL}/users`, {
next: {
tags: ['users'],
revalidate: 3600 // 1 hora
},
});

Utilidades Comunes
cn() - Tailwind Merge
typescript// shared/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs));
}

// Uso
import { cn } from '@/shared/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  'override-classes'
)} />
Date Utilities con date-fns
typescript// shared/lib/date-utils.ts
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

// Uso
import { formatDate, formatRelativeDate } from '@/shared/lib/date-utils';

<p>{formatDate(user.createdAt, 'dd/MM/yyyy')}</p>
<p>{formatRelativeDate(user.lastLogin)}</p>
Debounce Hook
typescript// shared/hooks/use-debounce.ts
'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
const [debouncedValue, setDebouncedValue] = useState<T>(value);

useEffect(() => {
const handler = setTimeout(() => {
setDebouncedValue(value);
}, delay);

    return () => {
      clearTimeout(handler);
    };

}, [value, delay]);

return debouncedValue;
}

// Uso
'use client';

import { useState } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';

export function SearchUsers() {
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

// debouncedSearch se actualiza 300ms después de que el usuario deja de escribir
const { data: users } = useUsers(debouncedSearch);

return (
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search users..."
/>
);
}

Data Tables con TanStack Table
typescript// features/users/components/user-table.tsx
'use client';

import { useMemo } from 'react';
import {
useReactTable,
getCoreRowModel,
getPaginationRowModel,
getSortedRowModel,
getFilteredRowModel,
flexRender,
type ColumnDef,
} from '@tanstack/react-table';
import type { User } from '../types';

interface Props {
users: User[];
}

export function UserTable({ users }: Props) {
const columns = useMemo<ColumnDef<User>[]>(
() => [
{
accessorKey: 'fullName',
header: 'Name',
},
{
accessorKey: 'email',
header: 'Email',
},
{
accessorKey: 'role',
header: 'Role',
},
{
id: 'actions',
cell: ({ row }) => (
<button onClick={() => console.log(row.original)}>
Edit
</button>
),
},
],
[]
);

const table = useReactTable({
data: users,
columns,
getCoreRowModel: getCoreRowModel(),
getPaginationRowModel: getPaginationRowModel(),
getSortedRowModel: getSortedRowModel(),
getFilteredRowModel: getFilteredRowModel(),
});

return (
<div>
<table>
<thead>
{table.getHeaderGroups().map((headerGroup) => (
<tr key={headerGroup.id}>
{headerGroup.headers.map((header) => (
<th key={header.id}>
{flexRender(
header.column.columnDef.header,
header.getContext()
)}
</th>
))}
</tr>
))}
</thead>
<tbody>
{table.getRowModel().rows.map((row) => (
<tr key={row.id}>
{row.getVisibleCells().map((cell) => (
<td key={cell.id}>
{flexRender(
cell.column.columnDef.cell,
cell.getContext()
)}
</td>
))}
</tr>
))}
</tbody>
</table>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>

);
}

Animaciones con Framer Motion
typescript// features/users/components/user-card.tsx
'use client';

import { motion } from 'framer-motion';
import type { User } from '../types';

interface Props {
user: User;
}

export function UserCard({ user }: Props) {
return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
className="p-4 border rounded-lg" >
<h3>{user.fullName}</h3>
<p>{user.email}</p>
</motion.div>
);
}

// Lista animada
'use client';

import { motion, AnimatePresence } from 'framer-motion';

export function UserList({ users }: { users: User[] }) {
return (
<AnimatePresence>
{users.map((user, index) => (
<motion.div
key={user.id}
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 20 }}
transition={{ delay: index * 0.1 }} >
<UserCard user={user} />
</motion.div>
))}
</AnimatePresence>
);
}

Charts con Recharts
typescript// features/dashboard/components/revenue-chart.tsx
'use client';

import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from 'recharts';

interface Props {
data: Array<{ month: string; revenue: number }>;
}

export function RevenueChart({ data }: Props) {
return (
<ResponsiveContainer width="100%" height={300}>
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          strokeWidth={2}
        />
</LineChart>
</ResponsiveContainer>
);
}

Theming con next-themes
typescript// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
return (
<html suppressHydrationWarning>
<body>
<ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
{children}
</ThemeProvider>
</body>
</html>
);
}

// shared/components/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
const { theme, setTheme } = useTheme();

return (
<Button
variant="ghost"
size="icon"
onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} >
<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
<span className="sr-only">Toggle theme</span>
</Button>
);
}

Checklist de Desarrollo
Antes de crear un nuevo feature:

¿El feature es autocontenido?
¿La estructura de carpetas sigue el estándar?
¿Los nombres son consistentes con las convenciones?
¿Se necesita realmente o puede ir en shared/?

Antes de hacer commit:

¿Los imports son directos (no barrel files)?
¿Los Server Components no tienen 'use client' innecesario?
¿Las validaciones están con Zod?
¿Los errores están manejados correctamente?
¿Los tipos están definidos?
¿No hay console.logs olvidados?
¿Las queries de React Query tienen keys únicas?
¿Los formularios usan react-hook-form con zodResolver?

Antes de crear un PR:

¿El código está formateado?
¿No hay dependencias circulares?
¿Los componentes pesados usan dynamic imports?
¿Las imágenes usan next/image?
¿Los toasts usan sonner?

Resumen de Reglas Críticas

NO usar archivos barrel (index.ts) excepto para types y constants
Imports directos y explícitos siempre
Server Components por defecto, 'use client' solo cuando sea necesario
Validación con Zod en server y client
react-hook-form + zodResolver para todos los formularios
TanStack Query para server state (queries y mutations)
axios para HTTP requests
Features autocontenidos - todo en una carpeta
shared/ solo para código usado en 3+ features
Naming conventions consistentes
Error handling en todos los niveles con try-catch y toast
sonner para notificaciones (toast)
date-fns para manejo de fechas
framer-motion para animaciones (con dynamic import si es pesado)
recharts para gráficos (siempre con dynamic import)
