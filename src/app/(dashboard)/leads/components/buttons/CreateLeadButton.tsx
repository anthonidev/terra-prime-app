'use client';

import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateLeadButton() {
  const router = useRouter();

  const handleCreateLead = () => {
    router.push('/leads/nuevo');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleCreateLead}
        className="hidden h-10 items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-4 text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex"
      >
        <UserPlus className="h-4 w-4" />
        <span>Nuevo Lead</span>
      </Button>

      <Button
        onClick={handleCreateLead}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-0 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:hidden"
      >
        <Plus className="h-5 w-5" />
        <span className="sr-only">Nuevo Lead</span>
      </Button>
    </div>
  );
}
