'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { Building2, CreditCard, DollarSign, User, MoreVertical, Eye, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AssignParticipantModal from './AssignParticipantModal';
import SaleDetailModal from './SaleDetailModal';
import { StatusBadge } from '@/components/common/table/StatusBadge';

type Props = {
  data: SaleList[];
};

const VentasCards = ({ data }: Props) => {
  const [selectedSale, setSelectedSale] = useState<SaleList | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const handleAssignParticipant = (sale: SaleList) => {
    setSelectedSale(sale);
    setIsAssignModalOpen(true);
  };

  const handleViewDetail = (sale: SaleList) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron ventas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {data.map((sale) => {
          return (
            <Card key={sale.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {sale.client.firstName} {sale.client.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cliente #{sale.id.substring(0, 8)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={sale.type === 'FINANCED' ? 'default' : 'secondary'}>
                      {sale.type === 'FINANCED' ? 'Financiado' : 'Directo'}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(sale)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignParticipant(sale)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Asignar Participante
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>Lote: {sale.lot.name}</span>
                    <span className="ml-auto font-medium">
                      {formatCurrency(Number(sale.lot.lotPrice))}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span>Total:</span>
                    <span className="ml-auto font-bold text-green-600">
                      {formatCurrency(Number(sale.totalAmount))}
                    </span>
                  </div>

                  {sale.vendor && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>
                        Vendedor: {sale.vendor.firstName} {sale.vendor.lastName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estado:
                    </span>
                    <StatusBadge status={sale.status} />
                  </div>

                  {sale.financing && (
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        <div>Inicial: {formatCurrency(Number(sale.financing.initialAmount))}</div>
                        <div>Tasa: {sale.financing.interestRate}%</div>
                        <div>Cuotas: {sale.financing.quantityCoutes}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modales */}
      {selectedSale && (
        <>
          <AssignParticipantModal
            isOpen={isAssignModalOpen}
            onClose={() => {
              setIsAssignModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
          />

          <SaleDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
          />
        </>
      )}
    </>
  );
};

export default VentasCards;
