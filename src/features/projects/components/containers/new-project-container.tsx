'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/shared/components/common/page-header';
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
      <PageHeader
        title="Crear Nuevo Proyecto"
        description="Carga un archivo Excel para crear etapas, manzanas y lotes de forma masiva"
        icon={FolderPlus}
      >
        <Link href="/proyectos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </PageHeader>

      {/* Steps Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Step 1: Download Template */}
        <Card className="relative overflow-hidden border-none shadow-sm">
          <div className="bg-primary/5 absolute inset-0" />
          <div className="bg-background/50 absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm">
            <span className="text-primary text-xs font-bold">1</span>
          </div>
          <CardHeader className="relative pb-2">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                <Download className="text-primary h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base">Descarga la Plantilla</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Obtén el formato Excel necesario para cargar la información.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-0">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-background h-8 w-full border-dashed text-xs"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Descargar plantilla Excel
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        <Card className="relative overflow-hidden border-none shadow-sm">
          <div className="bg-primary/5 absolute inset-0" />
          <div className="bg-background/50 absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm">
            <span className="text-primary text-xs font-bold">2</span>
          </div>
          <CardHeader className="relative pb-2">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                <Upload className="text-primary h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base">Carga tu Archivo</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Selecciona el archivo Excel completado.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="space-y-3">
              {/* File Input Area */}
              <div className="relative">
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-muted-foreground/25 bg-background/50 hover:bg-background hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors"
                  >
                    <div className="bg-muted mb-2 flex h-8 w-8 items-center justify-center rounded-full">
                      <Upload className="text-muted-foreground h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium">Haz clic para seleccionar</p>
                  </div>
                ) : (
                  <div className="bg-background border-border flex items-center justify-between gap-2 rounded-lg border p-2 shadow-sm">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="bg-success/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                        <FileSpreadsheet className="text-success h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{selectedFile.name}</p>
                        <p className="text-muted-foreground text-[10px]">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      disabled={isValidating || isCreating}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0 rounded-full"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                <Input
                  id="excel-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isValidating || isCreating}
                  className="hidden"
                />
              </div>

              {/* Validating State */}
              {isValidating && (
                <div className="bg-primary/5 border-primary/10 flex items-center gap-2 rounded-lg border p-2">
                  <div className="border-primary h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                  <span className="text-primary text-xs font-medium">Validando archivo...</span>
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
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-500">
          <ProjectSummary data={validationResult.data} />

          {/* Action Buttons */}
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">¿Todo listo?</h3>
                <p className="text-muted-foreground text-xs">Confirma para crear el proyecto.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isCreating}
                  size="sm"
                  className="h-8 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isCreating}
                  size="sm"
                  className="h-8 text-xs"
                >
                  {isCreating ? (
                    <>
                      <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="mr-2 h-3.5 w-3.5" />
                      Crear Proyecto
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
