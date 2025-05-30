'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import AssignVendorModal from './AssignVendorModal';

interface AssignVendorButtonProps {
  leadId: string;
}

export default function AssignVendorButton({ leadId }: AssignVendorButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8 px-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Asignar vendedor
      </Button>

      <AssignVendorModal
        leadIds={[leadId]}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
