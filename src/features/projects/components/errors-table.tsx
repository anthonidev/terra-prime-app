'use client';

import { AlertCircle } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import type { ValidationError } from '../types';

interface ErrorsTableProps {
  errors: ValidationError[];
}

export function ErrorsTable({ errors }: ErrorsTableProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Errores de validación</AlertTitle>
        <AlertDescription>
          Se encontraron {errors.length} error{errors.length !== 1 ? 'es' : ''} en el archivo.
          Por favor corrígelos y vuelve a intentar.
        </AlertDescription>
      </Alert>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Fila</TableHead>
              <TableHead className="w-40">Columna</TableHead>
              <TableHead>Mensaje de error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{error.row}</TableCell>
                <TableCell className="font-mono text-sm">{error.column}</TableCell>
                <TableCell className="text-destructive">{error.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
