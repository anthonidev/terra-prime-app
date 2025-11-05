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
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
              <FileX2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-destructive mb-1">
                Errores de validación encontrados
              </h3>
              <p className="text-sm text-muted-foreground">
                Se encontraron{' '}
                <Badge variant="destructive" className="mx-1 font-mono">
                  {errors.length}
                </Badge>
                {errors.length === 1 ? 'error' : 'errores'} en el archivo. Por favor corrígelos y vuelve a intentar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
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
                      <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {error.column}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-destructive font-medium">
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
