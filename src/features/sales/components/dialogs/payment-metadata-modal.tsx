'use client';

import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PaymentMetadataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metadata: Record<string, unknown> | null;
  paymentId: number;
}

function shouldHideKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();

  if (normalized === 'installments backup') return true;
  if (normalized === 'installments_backup') return true;
  if (normalized === 'installments-backup') return true;
  if (normalized === 'installmentsbackup') return true;

  return formatKey(key).trim().toLowerCase() === 'installments backup';
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('es-PE');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export function PaymentMetadataModal({
  open,
  onOpenChange,
  metadata,
  paymentId,
}: PaymentMetadataModalProps) {
  const entries = metadata ? Object.entries(metadata).filter(([key]) => !shouldHideKey(key)) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Metadata del Pago #{paymentId}
          </DialogTitle>
          <DialogDescription>Información adicional asociada al pago</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map(([key, value]) => (
                <div key={key} className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm font-medium">{formatKey(key)}</p>
                  {typeof value === 'object' && value !== null ? (
                    <pre className="bg-muted mt-1 overflow-x-auto rounded p-2 text-sm">
                      {formatValue(value)}
                    </pre>
                  ) : (
                    <p className="mt-1 font-medium">{formatValue(value)}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
              <p className="text-muted-foreground">No hay metadata disponible</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
