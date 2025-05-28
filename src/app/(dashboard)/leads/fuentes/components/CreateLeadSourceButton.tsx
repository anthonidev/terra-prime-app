'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateLeadSourceModal from './CreateLeadSourceModal';

export default function CreateLeadSourceButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary-hover"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nueva Fuente
      </Button>

      <CreateLeadSourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
