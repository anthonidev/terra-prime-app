'use client';

import { Button } from '@/components/ui/button';
import { Liner } from '@/types/leads.types';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import UpdateLinerModal from '../modal/UpdateLinerModal';

interface UpdateLinerButtonProps {
  liner: Liner;
}

export default function UpdateLinerButton({ liner }: UpdateLinerButtonProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsUpdateModalOpen(true)}
        className="h-8 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <Edit className="mr-2 h-4 w-4" />
        Editar
      </Button>

      <UpdateLinerModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        liner={liner}
      />
    </>
  );
}
