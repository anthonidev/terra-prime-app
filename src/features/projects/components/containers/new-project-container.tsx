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
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Proyecto</h1>
            </div>
            <p className="text-sm text-muted-foreground">
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
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
                <Download className="h-4 w-4 text-accent" />
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
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">2</span>
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-info/20 flex items-center justify-center">
                <Upload className="h-4 w-4 text-info" />
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
                <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50 border">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileSpreadsheet className="h-4 w-4 text-success shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={isValidating || isCreating}
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Validating State */}
              {isValidating && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-info/10 border border-info/20">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-info border-t-transparent" />
                  <span className="text-xs font-medium text-info">Validando archivo...</span>
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
                <p className="text-sm text-muted-foreground">
                  ¿Listo para crear el proyecto con esta información?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isCreating}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={isCreating}
                    size="sm"
                  >
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
