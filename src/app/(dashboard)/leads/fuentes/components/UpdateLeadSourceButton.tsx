'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LeadSource } from '@/types/leads.types';
import UpdateLeadSourceModal from './UpdateLeadSourceModal';

interface UpdateLeadSourceButtonProps {
  source: LeadSource;
}

export default function UpdateLeadSourceButton({ source }: UpdateLeadSourceButtonProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsUpdateModalOpen(true)}>
        Editar
      </Button>

      <UpdateLeadSourceModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        leadSource={source}
      />
    </>
  );
}
