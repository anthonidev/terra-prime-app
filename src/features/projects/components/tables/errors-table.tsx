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
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-destructive/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <FileX2 className="text-destructive h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-destructive mb-1 font-semibold">
                Errores de validación encontrados
              </h3>
              <p className="text-muted-foreground text-sm">
                Se encontraron{' '}
                <Badge variant="destructive" className="mx-1 font-mono">
                  {errors.length}
                </Badge>
                {errors.length === 1 ? 'error' : 'errores'} en el archivo. Por favor corrígelos y
                vuelve a intentar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-destructive/20 flex h-8 w-8 items-center justify-center rounded">
              <AlertCircle className="text-destructive h-4 w-4" />
            </div>
            <CardTitle className="text-base">Detalle de Errores</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Fila</TableHead>
                  <TableHead className="w-32">Columna</TableHead>
                  <TableHead>Mensaje de error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error, index) => (
                  <TableRow key={index} className="group">
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {error.row}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted rounded px-2 py-0.5 font-mono text-xs">
                        {error.column}
                      </code>
                    </TableCell>
                    <TableCell className="text-destructive text-sm font-medium">
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
