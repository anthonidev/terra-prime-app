'use client';

import { Search, Filter, Calendar, CheckCircle2, ArrowUpDown } from 'lucide-react';
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
import { StatusPayment, OrderBy, Order } from '../../types';
import { Separator } from '@/components/ui/separator';

interface PaymentsFiltersProps {
  search: string;
  status: StatusPayment | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  orderBy: OrderBy;
  order: Order;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusPayment | undefined) => void;
  onStartDateChange: (value: string | undefined) => void;
  onEndDateChange: (value: string | undefined) => void;
  onOrderByChange: (value: OrderBy) => void;
  onOrderChange: (value: Order) => void;
  totalItems?: number;
}

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: StatusPayment.PENDING, label: 'Pendiente' },
  { value: StatusPayment.APPROVED, label: 'Aprobado' },
  { value: StatusPayment.COMPLETED, label: 'Completado' },
  { value: StatusPayment.REJECTED, label: 'Rechazado' },
  { value: StatusPayment.CANCELLED, label: 'Cancelado' },
];

const orderByOptions = [
  { value: 'createdAt', label: 'Fecha de creación' },
  { value: 'numberTicket', label: 'N° Boleta' },
];

const orderOptions = [
  { value: 'DESC', label: 'Descendente' },
  { value: 'ASC', label: 'Ascendente' },
];

export function PaymentsFilters({
  search,
  status,
  startDate,
  endDate,
  orderBy,
  order,
  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onOrderByChange,
  onOrderChange,
  totalItems = 0,
}: PaymentsFiltersProps) {
  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onStatusChange(undefined);
    } else {
      onStatusChange(value as StatusPayment);
    }
  };

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusChange(undefined);
    onStartDateChange(undefined);
    onEndDateChange(undefined);
    onOrderByChange('numberTicket');
    onOrderChange('ASC');
  };

  const hasActiveFilters =
    search || status || startDate || endDate || orderBy !== 'numberTicket' || order !== 'ASC';

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por cliente, documento, lote o código..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-muted/30 border-muted-foreground/20 focus-visible:bg-background pl-9 transition-colors"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground h-9"
              >
                <Filter className="mr-2 h-3.5 w-3.5" />
                Limpiar
              </Button>
            )}
            <div className="text-muted-foreground bg-muted/30 border-border/50 rounded-md border px-3 py-1.5 text-sm">
              <span className="text-foreground font-medium">{totalItems}</span>{' '}
              {totalItems === 1 ? 'pago' : 'pagos'}
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Filters Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

          {/* Order By Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Ordenar por
            </label>
            <Select value={orderBy} onValueChange={(value) => onOrderByChange(value as OrderBy)}>
              <SelectTrigger className="bg-background border-input/60 h-9">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {orderByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Direction Filter */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Dirección
            </label>
            <Select value={order} onValueChange={(value) => onOrderChange(value as Order)}>
              <SelectTrigger className="bg-background border-input/60 h-9">
                <SelectValue placeholder="Dirección" />
              </SelectTrigger>
              <SelectContent>
                {orderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
