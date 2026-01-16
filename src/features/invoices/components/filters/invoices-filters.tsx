'use client';

import { Search, Filter, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InvoiceStatus, DocumentType, DocumentTypeLabels } from '../../types';
import { invoiceStatusConfig } from '../shared/status-config';

interface InvoicesFiltersProps {
  search: string;
  status: InvoiceStatus | undefined;
  documentType: DocumentType | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: InvoiceStatus | undefined) => void;
  onDocumentTypeChange: (value: DocumentType | undefined) => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  totalItems?: number;
}

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: InvoiceStatus.PENDING, label: invoiceStatusConfig[InvoiceStatus.PENDING].label },
  { value: InvoiceStatus.SENT, label: invoiceStatusConfig[InvoiceStatus.SENT].label },
  { value: InvoiceStatus.ACCEPTED, label: invoiceStatusConfig[InvoiceStatus.ACCEPTED].label },
  { value: InvoiceStatus.REJECTED, label: invoiceStatusConfig[InvoiceStatus.REJECTED].label },
  { value: InvoiceStatus.CANCELLED, label: invoiceStatusConfig[InvoiceStatus.CANCELLED].label },
];

const documentTypeOptions = [
  { value: 'all', label: 'Todos los tipos' },
  { value: String(DocumentType.INVOICE), label: DocumentTypeLabels[DocumentType.INVOICE] },
  { value: String(DocumentType.RECEIPT), label: DocumentTypeLabels[DocumentType.RECEIPT] },
];

export function InvoicesFilters({
  search,
  status,
  documentType,
  startDate,
  endDate,
  onSearchChange,
  onStatusChange,
  onDocumentTypeChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  hasFilters,
  totalItems = 0,
}: InvoicesFiltersProps) {
  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onStatusChange(undefined);
    } else {
      onStatusChange(value as InvoiceStatus);
    }
  };

  const handleDocumentTypeChange = (value: string) => {
    if (value === 'all') {
      onDocumentTypeChange(undefined);
    } else {
      onDocumentTypeChange(Number(value) as DocumentType);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por número, cliente o documento..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-muted/30 border-muted-foreground/20 focus-visible:bg-background pl-9 transition-colors"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground h-9"
              >
                <Filter className="mr-2 h-3.5 w-3.5" />
                Limpiar
              </Button>
            )}
            <div className="text-muted-foreground bg-muted/30 border-border/50 rounded-md border px-3 py-1.5 text-sm">
              <span className="text-foreground font-medium">{totalItems}</span>{' '}
              {totalItems === 1 ? 'comprobante' : 'comprobantes'}
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Filters Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Document Type Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <FileText className="h-3.5 w-3.5" />
              Tipo
            </label>
            <Select
              value={documentType !== undefined ? String(documentType) : 'all'}
              onValueChange={handleDocumentTypeChange}
            >
              <SelectTrigger className="bg-background border-input/60 h-9">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Estado
            </label>
            <Select value={status || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-background border-input/60 h-9">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Desde
            </label>
            <Input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange(e.target.value || undefined)}
              className="bg-background border-input/60 h-9"
            />
          </div>

          {/* End Date Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Hasta
            </label>
            <Input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange(e.target.value || undefined)}
              className="bg-background border-input/60 h-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
