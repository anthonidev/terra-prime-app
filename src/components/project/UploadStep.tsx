'use client';

import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { cn } from '@/lib/utils';
import {
  ExcelValidationResponse,
  ValidationError
} from '@infrastructure/types/projects/project.types';
import { motion } from 'framer-motion';
import { AlertCircle, File, FileSpreadsheet, UploadCloud, X } from 'lucide-react';
import React from 'react';

interface UploadStepProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isValidating: boolean;
  validateExcel: () => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  validationResult: {
    isValid: boolean;
    errors?: ValidationError[];
  } | null;
  setValidationResult: (result: ExcelValidationResponse | null) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({
  file,
  setFile,
  isValidating,
  validateExcel,
  handleFileChange,
  handleDrop,
  handleDragOver,
  validationResult,
  setValidationResult
}) => {
  return (
    <div className="space-y-6">
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center',
          'hover:border-primary/50 transition-colors',
          'bg-muted/20'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex max-w-md flex-col items-center">
          <div className="bg-primary/10 mb-4 rounded-full p-3">
            <UploadCloud className="text-primary h-10 w-10" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Arrastra tu archivo Excel aquí</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            O haz clic para seleccionar un archivo. El archivo debe seguir el formato de la
            plantilla.
          </p>
          <div className="relative mt-4 w-full">
            <Input
              id="file-upload"
              type="file"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
            <Button variant="outline" className="w-full">
              Seleccionar archivo
            </Button>
          </div>
          <a
            href="/templates/plantilla-carga-proyecto.xlsx"
            download
            className="text-primary mt-4 flex items-center text-sm"
          >
            <FileSpreadsheet className="mr-1 h-4 w-4" />
            Descargar plantilla
          </a>
        </div>
      </div>
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 rounded-md p-2">
                <File className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFile(null);
                setValidationResult(null);
              }}
              className="text-muted-foreground h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
      {validationResult && !validationResult.isValid && validationResult.errors && (
        <ValidationErrorsDisplay errors={validationResult.errors} />
      )}
      <div className="flex justify-end space-x-4">
        <Button
          disabled={!file || isValidating}
          onClick={validateExcel}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          {isValidating ? 'Validando...' : 'Validar archivo'}
        </Button>
      </div>
    </div>
  );
};
interface ValidationErrorsDisplayProps {
  errors: ValidationError[];
}
const ValidationErrorsDisplay: React.FC<ValidationErrorsDisplayProps> = ({ errors }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de validación</AlertTitle>
        <AlertDescription>
          Se encontraron errores en el archivo. Por favor, corrígelos e inténtalo de nuevo.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Errores encontrados</CardTitle>
          <CardDescription>Se detectaron {errors.length} errores en el archivo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fila</TableHead>
                <TableHead>Columna</TableHead>
                <TableHead>Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((error, index) => (
                <TableRow key={index}>
                  <TableCell>{error.row}</TableCell>
                  <TableCell>{error.column}</TableCell>
                  <TableCell>{error.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default UploadStep;
