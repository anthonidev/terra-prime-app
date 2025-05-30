import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnDef, flexRender, Table as TanStackTable } from '@tanstack/react-table';
import { Info, Settings2 } from 'lucide-react';
import { ReactNode } from 'react';

type Props<T> = {
  table: TanStackTable<T>;
  columns: ColumnDef<T>[];
  showColumnVisibility?: boolean;
  columnVisibilityLabel?: string;
  enableRowSelection?: boolean;
  selectedRows?: string[];
  onRowSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
  canSelectRow?: (row: T) => boolean;
  // Props para acciones en bulk
  bulkActions?: ReactNode;
  selectionMessage?: (count: number) => string;
};

const TableTemplate = <T,>({
  table,
  columns,
  showColumnVisibility = true,
  columnVisibilityLabel = 'Columnas',
  enableRowSelection = false,
  selectedRows = [],
  onRowSelectionChange,
  getRowId,
  canSelectRow,
  bulkActions,
  selectionMessage
}: Props<T>) => {
  const getRowIdentifier = (row: T): string => {
    if (getRowId) {
      return getRowId(row);
    }
    return (row as any)?.id || '';
  };

  const isRowSelectable = (row: T): boolean => {
    return canSelectRow ? canSelectRow(row) : true;
  };

  const selectableRows = table.getRowModel().rows.filter((row) => isRowSelectable(row.original));

  const handleRowSelection = (row: T, checked: boolean) => {
    if (!onRowSelectionChange || !isRowSelectable(row)) return;

    const rowId = getRowIdentifier(row);
    if (!rowId) return;

    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedRows, rowId];
    } else {
      newSelection = selectedRows.filter((id) => id !== rowId);
    }

    onRowSelectionChange(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelectionChange) return;

    if (checked) {
      const selectableIds = selectableRows
        .map((row) => getRowIdentifier(row.original))
        .filter((id) => id !== '');
      onRowSelectionChange(selectableIds);
    } else {
      onRowSelectionChange([]);
    }
  };

  const isRowSelected = (row: T): boolean => {
    const rowId = getRowIdentifier(row);
    return selectedRows.includes(rowId);
  };

  const areAllSelectableRowsSelected = (): boolean => {
    if (selectableRows.length === 0) return false;

    return selectableRows.every((row) => isRowSelected(row.original));
  };

  const areSomeRowsSelected = (): boolean => {
    return selectedRows.length > 0 && !areAllSelectableRowsSelected();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mensaje de selección */}
          {enableRowSelection && selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {selectionMessage
                  ? selectionMessage(selectedRows.length)
                  : `${selectedRows.length} elemento(s) seleccionado(s)`}
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

      {/* Tabla */}
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                  {enableRowSelection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={areAllSelectableRowsSelected()}
                        ref={(el) => {
                          const input = el as unknown as HTMLInputElement | null;
                          if (input) input.indeterminate = areSomeRowsSelected();
                        }}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todas las filas"
                        disabled={selectableRows.length === 0}
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
                  const isSelectable = isRowSelectable(row.original);
                  const isSelected = isRowSelected(row.original);

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`hover:bg-muted/50 transition-colors ${
                        enableRowSelection && isSelected
                          ? 'bg-muted/25 border-l-primary border-l-2'
                          : ''
                      } ${enableRowSelection && !isSelectable ? 'opacity-60' : ''}`}
                    >
                      {enableRowSelection && (
                        <TableCell className="w-12">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleRowSelection(row.original, checked as boolean)
                            }
                            disabled={!isSelectable}
                            aria-label={`Seleccionar fila ${row.id}`}
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
