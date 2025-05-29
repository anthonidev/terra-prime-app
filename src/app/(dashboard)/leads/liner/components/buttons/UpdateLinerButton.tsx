'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Liner } from '@/types/leads.types';
import UpdateLinerModal from '../modal/UpdateLinerModal';

interface UpdateLinerButtonProps {
  liner: Liner;
}

export default function UpdateLinerButton({ liner }: UpdateLinerButtonProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsUpdateModalOpen(true)}>
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
