'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import LeadDetailModal from './LeadDetailModal';

interface Props {
  lead: LeadsOfDay;
}

export default function LeadDetailButton({ lead }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8"
      >
        <Eye className="mr-2 h-4 w-4" />
        Detalles
      </Button>

      <LeadDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={lead}
      />
    </>
  );
}