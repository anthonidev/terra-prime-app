'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import AssignLeadParticipantModal from './AssignLeadParticipantModal';

interface Props {
  lead: LeadsOfDay;
}

export default function AssignLeadParticipantButton({ lead }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Participantes
      </Button>

      <AssignLeadParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={lead}
      />
    </>
  );
}