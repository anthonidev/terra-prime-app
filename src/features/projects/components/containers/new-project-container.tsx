'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, FileSpreadsheet, FolderPlus, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useNewProjectContainer } from '../../hooks/use-new-project-container';
import { ProjectSummary } from '../displays/project-summary';
import { ErrorsTable } from '../tables/errors-table';

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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <FolderPlus className="text-primary h-6 w-6" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Proyecto</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Carga un archivo Excel para crear etapas, manzanas y lotes de forma masiva
            </p>
          </div>
        </div>
        <Link href="/proyectos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Steps Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Step 1: Download Template */}
        <Card className="hover:border-primary/50 relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="bg-primary/10 absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-bold">1</span>
          </div>
          <CardHeader className="pb-3">
            <div className="mb-1 flex items-center gap-2">
              <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded">
                <Download className="text-accent h-4 w-4" />
              </div>
              <CardTitle className="text-base">Descarga la Plantilla</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Descarga el formato Excel para cargar tu proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadTemplate} variant="outline" size="sm" className="w-full">
              <Download className="mr-2 h-3.5 w-3.5" />
              Descargar plantilla Excel
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        <Card className="hover:border-primary/50 relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="bg-primary/10 absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-bold">2</span>
          </div>
          <CardHeader className="pb-3">
            <div className="mb-1 flex items-center gap-2">
              <div className="bg-info/20 flex h-8 w-8 items-center justify-center rounded">
                <Upload className="text-info h-4 w-4" />
              </div>
              <CardTitle className="text-base">Carga tu Archivo</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Selecciona el Excel con la información del proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* File Input */}
              <div className="relative">
                <Input
                  id="excel-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isValidating || isCreating}
                  className="cursor-pointer"
                />
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="bg-muted/50 flex items-center justify-between gap-2 rounded-md border p-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <FileSpreadsheet className="text-success h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{selectedFile.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={isValidating || isCreating}
                    className="h-7 w-7 shrink-0 p-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Validating State */}
              {isValidating && (
                <div className="bg-info/10 border-info/20 flex items-center gap-2 rounded-md border p-2">
                  <div className="border-info h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  <span className="text-info text-xs font-medium">Validando archivo...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      {validationResult && !validationResult.isValid && validationResult.errors && (
        <ErrorsTable errors={validationResult.errors} />
      )}

      {validationResult && validationResult.isValid && validationResult.data && (
        <>
          <ProjectSummary data={validationResult.data} />

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  ¿Listo para crear el proyecto con esta información?
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset} disabled={isCreating} size="sm">
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProject} disabled={isCreating} size="sm">
                    {isCreating ? (
                      <>
                        <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <FolderPlus className="mr-2 h-3.5 w-3.5" />
                        Crear proyecto
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
