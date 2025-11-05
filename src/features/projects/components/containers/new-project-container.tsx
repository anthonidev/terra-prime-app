'use client';

import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileSpreadsheet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useNewProjectContainer } from '../../hooks/use-new-project-container';
import { ErrorsTable } from '../tables/errors-table';
import { ProjectSummary } from '../displays/project-summary';

export function NewProjectContainer() {
  const {
    selectedFile,
    validationResult,
    fileInputRef,
    isValidating,
    isCreating,
    handleFileChange,
    handleDownloadTemplate,
    handleCreateProject,
    handleReset,
  } = useNewProjectContainer();

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back */}
      <Link href="/proyectos">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a proyectos
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Crear nuevo proyecto</h1>
        <p className="text-muted-foreground mt-2">
          Carga un archivo Excel con la información del proyecto para crear etapas, manzanas y lotes de forma masiva.
        </p>
      </div>

      {/* Download Template Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Plantilla de Excel
          </CardTitle>
          <CardDescription>
            Descarga la plantilla de Excel con el formato correcto para cargar tu proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDownloadTemplate} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Descargar plantilla
          </Button>
        </CardContent>
      </Card>

      {/* Upload File Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cargar archivo Excel
          </CardTitle>
          <CardDescription>
            Selecciona el archivo Excel con la información del proyecto. Se validará automáticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Archivo Excel</Label>
            <div className="flex items-center gap-3">
              <Input
                id="excel-file"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isValidating || isCreating}
                className="flex-1"
              />
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isValidating || isCreating}
                >
                  Limpiar
                </Button>
              )}
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{selectedFile.name}</span>
                <span className="text-xs">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          {isValidating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Validando archivo...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && !validationResult.isValid && validationResult.errors && (
        <ErrorsTable errors={validationResult.errors} />
      )}

      {validationResult && validationResult.isValid && validationResult.data && (
        <>
          <ProjectSummary data={validationResult.data} />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={isCreating}
            >
              {isCreating ? 'Creando proyecto...' : 'Crear proyecto'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
