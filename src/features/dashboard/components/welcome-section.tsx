'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Sparkles } from 'lucide-react';

export function WelcomeSection() {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.firstName + ' ' + user.lastName;
  const currentHour = new Date().getHours();

  let greeting = 'Buenas noches';
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Buenos días';
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = 'Buenas tardes';
  }

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-4">
        <div>
          <Sparkles className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {greeting}, {firstName}!
        </h1>
      </div>
      <p className="text-muted-foreground ml-12 text-lg">
        Bienvenido a Terra Prime. Selecciona un módulo para comenzar.
      </p>
    </div>
  );
}
