import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef, flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { Info, Settings2 } from 'lucide-react';

// Define el tipo genérico para las props
type Props<T> = {
  table: TanStackTable<T>;
  columns: ColumnDef<T>[];
  showColumnVisibility?: boolean;
  columnVisibilityLabel?: string;
};

// Hace el componente genérico
const TableTemplate = <T,>({
  table,
  columns,
  showColumnVisibility = true,
  columnVisibilityLabel = 'Columnas'
}: Props<T>) => {
  return (
    <div className="space-y-4">
      {/* Header con controles de visibilidad */}
      {showColumnVisibility && (
        <div className="flex items-center justify-end">
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

                  // Obtener el texto del header
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
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
