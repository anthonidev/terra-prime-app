'use client';

import { StatusBadge } from '@/components/common/table/StatusBadge';
import { TablePagination } from '@/components/common/table/TablePagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SalesItem } from '@/types/sales';
import { AlertCircle, CalendarClock, RefreshCw } from 'lucide-react';

interface Props {
  salesItems: SalesItem[];
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
}

export default function SalesTable({
  salesItems,
  isLoading,
  error,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onRefresh
}: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isLoading) {
    return <ReconsumptionsTableSkeleton />;
  }

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

  // Renderizar diferente versión según el tamaño de la pantalla
  if (isMobile) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="text-primary h-5 w-5" />
            Historial de Reconsumos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesItems.length > 0 ? (
              salesItems.map((reconsumo) => (
                <Card key={reconsumo.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col divide-y">
                      {/* Cabecera con estado e ID */}
                      <div className="bg-muted/20 flex items-center justify-between p-4">
                        <StatusBadge status={reconsumo.status} />
                        <div className="text-sm font-medium">
                          <span>#{reconsumo.id}</span>
                        </div>
                      </div>

                      {/* Contenido principal */}
                      <div className="space-y-3 p-4">
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-xs">Fecha del período:</div>
                          <div className="text-sm">
                            {/* {format(
                              new Date(reconsumo.periodDate),
                              "dd/MM/yyyy",
                              { locale: es }
                            )} */}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-xs">Monto:</div>
                          <div className="text-primary text-sm font-bold">
                            {/* {formatCurrency(reconsumo.amount)} */}250
                          </div>
                        </div>

                        {/* {reconsumo.methodPayment && (
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground text-xs">Método de pago:</div>
                            <div className="flex items-center gap-1 text-sm">
                              {reconsumo.methodPayment === 'POINTS' ? (
                                <>
                                  <Coins className="text-primary h-3 w-3" />
                                  <span>Puntos</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="text-primary h-3 w-3" />
                                  <span>Comprobante</span>
                                </>
                              )}
                            </div>
                          </div>
                        )} */}

                        {/* <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-xs">Creado:</div>
                          <div className="text-sm">
                            {format(new Date(reconsumo.createdAt), 'dd/MM/yyyy HH:mm', {
                              locale: es
                            })}
                          </div>
                        </div>

                        {reconsumo.paymentReference && (
                          <div className="flex items-start gap-2">
                            <div className="text-muted-foreground text-xs">Referencia:</div>
                            <div className="text-sm">{reconsumo.paymentReference || '—'}</div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No hay reconsumos registrados</p>
              </div>
            )}

            {meta && meta.totalItems > 0 && (
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
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="text-primary h-5 w-5" />
          <span>Historial de Reconsumos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesItems.length > 0 ? (
                salesItems.map((reconsumo) => (
                  <TableRow key={reconsumo.id}>
                    <TableCell className="font-medium">#{reconsumo.id}</TableCell>
                    {/* <TableCell>{formatCurrency(reconsumo.amount)}</TableCell> */}
                    <TableCell>
                      <StatusBadge status={reconsumo.status} />
                    </TableCell>
                    {/* <TableCell>
                      {format(new Date(reconsumo.periodDate), 'dd/MM/yyyy', {
                        locale: es
                      })}
                    </TableCell> */}
                    {/* <TableCell>
                      {reconsumo.methodPayment ? (
                        <div className="flex items-center gap-1">
                          {reconsumo.methodPayment === 'POINTS' ? (
                            <>
                              <Coins className="text-primary h-4 w-4" />
                              <span>Puntos</span>
                            </>
                          ) : (
                            <>
                              <FileText className="text-primary h-4 w-4" />
                              <span>Comprobante</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reconsumo.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>{reconsumo.paymentReference || '—'}</TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                    No hay reconsumos registrados
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
      </CardContent>
    </Card>
  );
}

function ReconsumptionsTableSkeleton() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
            <Skeleton className="h-8 w-full sm:w-48" />
            <Skeleton className="h-8 w-full sm:w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-8" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between space-x-2">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  );
}
