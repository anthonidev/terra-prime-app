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
import { VendorsActivesItem } from '@/types/sales';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';
import * as React from 'react';
import { Input } from '@/components/ui/input';

interface Props {
  data: VendorsActivesItem[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
}

export default function VendorsActivesTable({ data, isLoading, error, onRefresh }: Props) {
  const [searchData, setSearchData] = React.useState<string>('');
  const bMobile = useMediaQuery('(max-width: 768px)');

  const filteredData = React.useMemo(() => {
    return data.filter((vendor) =>
      vendor.firstName.toLowerCase().includes(searchData.toLowerCase())
    );
  }, [data, searchData]);

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
      <div className="pb-4">
        <div className="relative w-full lg:max-w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-white pl-10 text-sm dark:bg-gray-900"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
      </div>
      {bMobile ? (
        filteredData.map((item, index) => (
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
                    <div className="text-muted-foreground text-sm">Email:</div>
                    <div className="text-primary truncate text-sm">{item.email}</div>
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
                <TableHead>Documento</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((leads, i) => (
                  <TableRow key={leads.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{leads.firstName}</TableCell>
                    <TableCell>{leads.lastName}</TableCell>
                    <TableCell>{leads.email}</TableCell>
                    <TableCell>{leads.document}</TableCell>
                    <TableCell>{leads.photo}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                    Sin registros existentes para <strong>{searchData}</strong>
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
