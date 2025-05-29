'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateLinerModal from '../modal/CreateLinerModal';

export default function CreateLinerButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary-hover"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Liner
      </Button>

      <CreateLinerModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}
