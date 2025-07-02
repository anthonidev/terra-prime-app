import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search
} from 'lucide-react';
import { useState } from 'react';
import LotActions from './LotActions';
import { LotResponseDto } from '@infrastructure/types/projects/project.types';
interface ProjectLotsTableProps {
  lots: LotResponseDto[];
  isLoading: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCreateLot: (blockId?: string) => void;
  onEditLot: (lot: LotResponseDto) => void;
  currency: string;
}
export default function ProjectLotsTable({
  lots,
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onCreateLot,
  onEditLot,
  currency
}: ProjectLotsTableProps) {
  const [activeSortColumn, setActiveSortColumn] = useState<string | null>(null);
  const handleSort = (column: string) => {
    if (activeSortColumn !== column) {
      setActiveSortColumn(column);
    }
  };
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency === 'PEN' ? 'PEN' : 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400';
      case 'Inactivo':
        return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-400';
      case 'Vendido':
        return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900 dark:text-purple-400';
      case 'Separado':
        return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };
  const getResultsRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);
    return `${start}-${end} de ${totalItems}`;
  };
  const lotsByStatus = {
    activos: lots.filter((lot) => lot.status === 'Activo').length,
    inactivos: lots.filter((lot) => lot.status === 'Inactivo').length,
    vendidos: lots.filter((lot) => lot.status === 'Vendido').length,
    separados: lots.filter((lot) => lot.status === 'Separado').length
  };
  const totalLotValue = lots.reduce((sum, lot) => sum + lot.totalPrice, 0);

  if (isLoading) {
    return (
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3 p-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!lots.length) {
    return (
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex items-center justify-between pb-3">
          <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
          <LotActions variant="table-header" onCreateClick={onCreateLot} />
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/5 rounded-md border border-dashed py-12 text-center">
            <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground/40 h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No se encontraron lotes</h3>
            <p className="text-muted-foreground mx-auto mb-6 max-w-md">
              No hay lotes que coincidan con los filtros seleccionados. Intenta ajustar tus
              criterios de búsqueda.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => onPageChange(1)}>
                Reiniciar filtros
              </Button>
              <Button
                onClick={() => onCreateLot()}
                className="bg-primary text-primary-foreground"
                size="sm"
              >
                Crear lote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-md">Lotes del Proyecto</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              {totalItems} {totalItems === 1 ? 'resultado' : 'resultados'}
            </Badge>
          </div>
          {}
          <div className="mt-2 flex items-center gap-3 text-xs">
            <div className="flex items-center">
              <div className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></div>
              <span>{lotsByStatus.activos} activos</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1.5 h-2 w-2 rounded-full bg-blue-500"></div>
              <span>{lotsByStatus.separados} separados</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1.5 h-2 w-2 rounded-full bg-purple-500"></div>
              <span>{lotsByStatus.vendidos} vendidos</span>
            </div>
            <div className="flex items-center">
              <div className="mr-1.5 h-2 w-2 rounded-full bg-gray-400"></div>
              <span>{lotsByStatus.inactivos} inactivos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Exportar a Excel</DropdownMenuItem>
              <DropdownMenuItem>Exportar a CSV</DropdownMenuItem>
              <DropdownMenuItem>Imprimir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <LotActions variant="table-header" onCreateClick={onCreateLot} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="bg-secondary/10 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center gap-1"
                      onClick={() => handleSort('name')}
                    >
                      Ubicación
                      {activeSortColumn === 'name' && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center justify-end gap-1"
                      onClick={() => handleSort('area')}
                    >
                      Área (m²)
                      {activeSortColumn === 'area' && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center justify-end gap-1"
                      onClick={() => handleSort('lotPrice')}
                    >
                      Precio Lote
                      {activeSortColumn === 'lotPrice' && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center justify-end gap-1"
                      onClick={() => handleSort('urbanizationPrice')}
                    >
                      Precio Urb.
                      {activeSortColumn === 'urbanizationPrice' && (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center justify-end gap-1"
                      onClick={() => handleSort('totalPrice')}
                    >
                      Precio Total
                      {activeSortColumn === 'totalPrice' && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">
                    <div
                      className="hover:text-primary flex cursor-pointer items-center gap-1"
                      onClick={() => handleSort('status')}
                    >
                      Estado
                      {activeSortColumn === 'status' && <ArrowUpDown className="h-3.5 w-3.5" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] text-right font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {lots.map((lot, index) => {
                    return (
                      <motion.tr
                        key={lot.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-secondary/5 cursor-pointer"
                        onClick={() => onEditLot(lot)}
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 text-primary flex h-8 w-10 items-center justify-center rounded-md font-medium">
                              {lot.name}
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="text-muted-foreground text-xs">
                                Etapa: <span className="font-medium">{lot.stageName}</span>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                Mz: <span className="font-medium">{lot.blockName}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          {typeof lot.area === 'number'
                            ? lot.area.toFixed(2)
                            : Number(lot.area).toFixed(2)}
                        </TableCell>
                        <TableCell className="py-2 text-right font-medium">
                          {formatCurrency(lot.lotPrice, currency)}
                        </TableCell>
                        <TableCell className="py-2 text-right font-medium">
                          {formatCurrency(lot.urbanizationPrice, currency)}
                        </TableCell>
                        <TableCell className="py-2 text-right font-medium">
                          {formatCurrency(lot.totalPrice, currency)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge className={`border ${getStatusBgColor(lot.status)}`}>
                            {lot.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            <LotActions
                              variant="table-cell"
                              lot={lot}
                              onCreateClick={onCreateLot}
                              onEditClick={onEditLot}
                            />
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          {}
          <div className="bg-card/60 flex flex-col border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 flex items-center gap-3 sm:mb-0">
              <div className="text-muted-foreground text-sm">Mostrando {getResultsRange()}</div>
              <div className="text-primary text-sm font-medium">
                {formatCurrency(totalLotValue, currency)} en total
              </div>
            </div>
            <div className="flex items-center justify-end space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="hidden h-8 w-8 sm:flex"
                aria-label="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                <span className="hidden text-xs sm:inline">Anterior</span>
              </Button>
              <span className="px-2 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8"
              >
                <span className="hidden text-xs sm:inline">Siguiente</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden h-8 w-8 sm:flex"
                aria-label="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
