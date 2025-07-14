'use client';

import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import PaymentsModal from './PaymentsModal';
import { FinancingInstallmentCollector } from '@domain/entities/cobranza';
import { CurrencyType } from '@domain/entities/sales/payment.entity';

interface Props {
  currency: CurrencyType;
  data: FinancingInstallmentCollector;
}

export default function PaymentsButton({ currency, data }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="hover:bg-primary/10 hover:text-primary"
        title="Ver detalles"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Ver detalles</span>
      </Button>

      <PaymentsModal
        currency={currency}
        data={data}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
