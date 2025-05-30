'use client';

import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import AssignVendorModal from './AssignVendorModal';

interface AssignVendorButtonProps {
  leadId: string;
  hasVendor?: boolean;
}

export default function AssignVendorButton({ leadId, hasVendor = false }: AssignVendorButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-8 px-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {hasVendor ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reasignar
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Asignar
          </>
        )}
      </Button>

      <AssignVendorModal
        leadIds={[leadId]}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
