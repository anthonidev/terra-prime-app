'use client';

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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LeadsVendorItems } from '@/types/sales';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';

interface Props {
  data: LeadsVendorItems[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
}

export default function LeadsVendorTable({ data, isLoading, error, onRefresh }: Props) {
  const bMobile = useMediaQuery('(max-width: 768px)');

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

  return (
    <div>
      {bMobile ? (
        data.map((item, index) => (
          <Card key={item.id} className="mb-4 overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="flex flex-col divide-y font-medium">
                <div className="bg-muted/20 flex items-center justify-between p-4">
                  <div className="text-sm">
                    <span>#{index + 1}</span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-2">
                    <div className="text-muted-foreground text-sm">Nombre</div>
                    <div className="truncate text-sm">{item.firstName}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-muted-foreground text-sm">Apellido:</div>
                    <div className="text-primary text-sm">{item.lastName}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-muted-foreground text-sm">Documento:</div>
                    <div className="text-primary text-sm">{item.document}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-muted-foreground text-sm">Teléfono:</div>
                    <div className="text-primary text-sm">{item.phone}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((leads, i) => (
                  <TableRow key={leads.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{leads.firstName}</TableCell>
                    <TableCell>{leads.lastName}</TableCell>
                    <TableCell>{leads.age}</TableCell>
                    <TableCell>{leads.document}</TableCell>
                    <TableCell>{leads.phone}</TableCell>
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
      )}
    </div>
  );
}
