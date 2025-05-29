'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateLeadSourceModal from '../modal/CreateLeadSourceModal';

export default function CreateLeadSourceButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex h-9 items-center gap-2 px-4"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Nueva Fuente</span>
        <span className="sm:hidden">Nueva</span>
      </Button>

      <CreateLeadSourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
