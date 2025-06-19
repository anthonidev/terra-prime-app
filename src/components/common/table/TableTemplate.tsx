import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ColumnDef, flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { Info, Settings2 } from 'lucide-react';
import { ReactNode } from 'react';

type Props<T> = {
  table: TanStackTable<T>;
  columns: ColumnDef<T>[];
  showColumnVisibility?: boolean;
  columnVisibilityLabel?: string;
  enableRowSelection?: boolean;
  bulkActions?: ReactNode;
  selectionMessage?: (count: number) => string;
};

const TableTemplate = <T,>({
  table,
  columns,
  showColumnVisibility = true,
  columnVisibilityLabel = 'Columnas',
  enableRowSelection = false,
  bulkActions,
  selectionMessage
}: Props<T>) => {
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {enableRowSelection && selectedRowsCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {selectionMessage
                  ? selectionMessage(selectedRowsCount)
                  : `${selectedRowsCount} elemento(s) seleccionado(s)`}
              </span>
              {bulkActions}
            </div>
          )}
        </div>

        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-4" />
                {columnVisibilityLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnDef = column.columnDef as ColumnDef<T>;
                  const header = columnDef.header;

                  const headerText =
                    typeof header === 'string'
                      ? header
                      : typeof header === 'function'
                        ? column.id
                        : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {headerText}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                  {enableRowSelection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Seleccionar todas las filas"
                        className="translate-y-[2px]"
                      />
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-10 text-sm font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const canSelect = row.getCanSelect();
                  const isSelected = row.getIsSelected();

                  return (
                    <TableRow
                      key={row.id}
                      data-state={isSelected && 'selected'}
                      className={`hover:bg-muted/50 transition-colors ${
                        enableRowSelection && isSelected
                          ? 'bg-muted/25 border-l-primary border-l-2'
                          : ''
                      } ${enableRowSelection && !canSelect ? 'opacity-60' : ''}`}
                    >
                      {enableRowSelection && (
                        <TableCell className="w-12">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            disabled={!canSelect}
                            aria-label={`Seleccionar fila ${row.id}`}
                            className="translate-y-[2px]"
                          />
                        </TableCell>
                      )}
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-6">
                      <Info className="text-muted-foreground/70 mb-2 h-8 w-8" />
                      <p>No se encontraron resultados</p>
                      <p className="mt-1 text-sm">
                        Intenta ajustar los filtros para ver más resultados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableTemplate;
