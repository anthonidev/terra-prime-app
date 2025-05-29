'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateLinerModal from '../modal/CreateLinerModal';

export default function CreateLinerButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex h-9 items-center gap-2 px-4"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Nuevo Liner</span>
        <span className="sm:hidden">Nuevo</span>
      </Button>

      <CreateLinerModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}
