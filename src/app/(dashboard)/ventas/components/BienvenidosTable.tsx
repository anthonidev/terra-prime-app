'use client';

import { TablePagination } from '@/components/common/table/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AssignLeadsToVendorDto, LeadsByDayItem } from '@/types/sales';
import { AlertCircle, RefreshCw, User } from 'lucide-react';
import MobileTable from './MobileTable';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AsignVendorModal } from './AsignVendorModal';

interface Props {
  data: LeadsByDayItem[];
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRefresh: () => void;
  onAssign: (data: AssignLeadsToVendorDto) => Promise<LeadsByDayItem[]>;
}

export default function BienvenidosTable({
  data,
  isLoading,
  error,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onAssign
}: Props) {
  const bMobile = useMediaQuery('(max-width: 768px)');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar las ventas del día
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="mt-2 border-red-200 text-red-600 dark:border-red-800/50 dark:text-red-400"
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bMobile)
    return (
      <MobileTable
        data={data}
        meta={meta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        variant="outline"
        hidden={selectedItems.length > 0 ? false : true}
        size="sm"
        className="mt-2 border-blue-200 text-blue-600 transition-colors hover:text-blue-500 dark:border-blue-800/50 dark:text-blue-400"
      >
        <User className="mr-1 h-3.5 w-3.5" />
        Asignar vendedor
      </Button>

      <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox onCheckedChange={() => {}} />
              </TableHead>
              <TableHead>Nº</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Fecha Creada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((leads, i) => (
                <TableRow key={leads.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(leads.id)}
                      onCheckedChange={() => toggleItem(leads.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{leads.firstName}</TableCell>
                  <TableCell>{leads.lastName}</TableCell>
                  <TableCell>{leads.document}</TableCell>
                  <TableCell>{leads.phone}</TableCell>
                  <TableCell>{leads.age}</TableCell>
                  <TableCell>
                    {typeof leads.vendor === 'string'
                      ? leads.vendor
                      : leads.vendor
                        ? `${leads.vendor.firstName} ${leads.vendor.lastName}`
                        : 'No asignado'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(leads.createdAt), 'dd/MM/yyyy HH:mm', {
                      locale: es
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                  Sin registros existentes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalItems > 0 && (
        <div className="mt-4">
          <TablePagination
            pagination={{
              pageIndex: currentPage - 1,
              pageSize: itemsPerPage
            }}
            pageCount={meta.totalPages}
            pageIndex={currentPage - 1}
            canNextPage={currentPage >= meta.totalPages}
            canPreviousPage={currentPage <= 1}
            setPageIndex={(idx) => onPageChange(Number(idx) + 1)}
            setPageSize={() => onPageSizeChange}
            previousPage={() => onPageChange(Math.max(1, currentPage - 1))}
            nextPage={() => onPageChange(Math.min(meta.totalPages, currentPage + 1))}
            totalItems={meta.totalItems}
          />
        </div>
      )}
      <AsignVendorModal
        leads={Array.from(selectedItems)}
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onAssign={onAssign}
      />
    </>
  );
}
