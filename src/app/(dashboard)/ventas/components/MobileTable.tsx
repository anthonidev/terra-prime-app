import { TablePagination } from '@/components/common/table/TablePagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadsByDayItem } from '@/types/sales';
import { Check, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Props {
  data: LeadsByDayItem[];
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
}

export default function MobileTable({
  data,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange
}: Props) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <User className="text-primary h-5 w-5" />
          Bienvenidos del día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card key={item.id} className="overflow-hidden py-0">
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
                        <div className="text-muted-foreground text-sm">Edad:</div>
                        <div className="text-primary text-sm">{item.age}</div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="text-muted-foreground text-sm">Teléfono:</div>
                        <div className="text-primary text-sm">{item.phone}</div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="text-muted-foreground text-xs">Creado:</div>
                        <div className="text-sm">
                          {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', {
                            locale: es
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/10 flex gap-2 p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                        className="flex flex-1 items-center justify-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Elejir</span>
                      </Button>
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
