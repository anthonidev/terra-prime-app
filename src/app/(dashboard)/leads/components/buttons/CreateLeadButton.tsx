'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateLeadButton() {
  const router = useRouter();

  const handleCreateLead = () => {
    router.push('/leads/nuevo');
  };

  return (
    <Button
      onClick={handleCreateLead}
      className="bg-primary text-primary-foreground hover:bg-primary-hover"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nuevo Lead
    </Button>
  );
}
