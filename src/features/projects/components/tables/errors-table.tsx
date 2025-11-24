'use client';

import { AlertCircle, FileX2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { ValidationError } from '../../types';

interface ErrorsTableProps {
  errors: ValidationError[];
}

export function ErrorsTable({ errors }: ErrorsTableProps) {
  return (
    <div className="space-y-4">
      {/* Error Banner */}
      <div className="bg-destructive/10 border-destructive/20 flex items-start gap-3 rounded-lg border p-3">
        <div className="bg-destructive/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <FileX2 className="text-destructive h-4 w-4" />
        </div>
        <div>
          <h3 className="text-destructive text-sm font-semibold">Errores de validación</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Se encontraron <span className="text-destructive font-bold">{errors.length}</span>{' '}
            {errors.length === 1 ? 'error' : 'errores'}. Por favor corrígelos.
          </p>
        </div>
      </div>

      {/* Errors Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <AlertCircle className="text-destructive h-4 w-4" />
            </div>
            <CardTitle className="text-base">Detalle de Errores</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 w-20 pl-4 text-xs">Fila</TableHead>
                  <TableHead className="h-9 w-28 text-xs">Columna</TableHead>
                  <TableHead className="h-9 text-xs">Mensaje de error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="py-2 pl-4">
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 font-mono text-[10px] font-medium"
                      >
                        {error.row}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[10px] font-medium">
                        {error.column}
                      </code>
                    </TableCell>
                    <TableCell className="text-destructive py-2 text-xs font-medium">
                      {error.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
