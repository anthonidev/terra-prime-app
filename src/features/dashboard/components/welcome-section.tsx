'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Sparkles } from 'lucide-react';

function WelcomeSkeleton() {
  return (
    <div className="from-primary/5 to-chart-2/5 relative overflow-hidden rounded-xl border bg-gradient-to-r via-transparent p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function WelcomeSection() {
  const { user, isLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) return <WelcomeSkeleton />;
  if (!user) return null;

  const currentHour = new Date().getHours();

  let greeting = 'Buenas noches';
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Buenos días';
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = 'Buenas tardes';
  }

  const today = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="from-primary/5 to-chart-2/5 relative overflow-hidden rounded-xl border bg-gradient-to-r via-transparent p-6"
    >
      {/* Decorative circles */}
      <div
        className="bg-primary/5 absolute -top-10 -right-10 h-40 w-40 rounded-full"
        aria-hidden="true"
      />
      <div
        className="bg-chart-2/5 absolute -bottom-8 -left-8 h-32 w-32 rounded-full"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Greeting */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="text-primary h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}, {user.fullName}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Bienvenido a Terra Prime. Selecciona un módulo para comenzar.
            </p>
          </div>
        </div>

        {/* Right: Date + Role */}
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span className="capitalize">{today}</span>
          </div>
          <Badge variant="secondary">{user.role.name}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
