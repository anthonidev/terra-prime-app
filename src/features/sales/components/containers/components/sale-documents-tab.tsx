'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, ExternalLink, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { formatDateOnly } from '@/shared/utils/date-formatter';

import { useSaleFiles, useUploadSaleFile, useDeleteSaleFile } from '../../../hooks/use-sale-files';

interface SaleDocumentsTabProps {
  saleId: string;
}

export function SaleDocumentsTab({ saleId }: SaleDocumentsTabProps) {
  const { data: files, isLoading } = useSaleFiles(saleId);
  const uploadFile = useUploadSaleFile(saleId);
  const deleteFile = useDeleteSaleFile(saleId);
  const { confirm, ConfirmationDialog } = useConfirmation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadFile.mutate(
      { file: selectedFile, description },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setDescription('');
        },
      }
    );
  };

  const handleDelete = async (fileId: string) => {
    const confirmed = await confirm({
      title: 'Eliminar archivo',
      description:
        '¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (confirmed) {
      deleteFile.mutate(fileId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const hasFiles = files && files.length > 0;

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="text-muted-foreground mb-2 h-8 w-8" />
            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground text-xs">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-muted-foreground text-sm">Suelta el archivo aquí</p>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Arrastra un archivo aquí o haz clic para seleccionar
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="file-description">Descripción (opcional)</Label>
                <Input
                  id="file-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción del archivo"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploadFile.isPending} size="sm">
                  {uploadFile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setDescription('');
                  }}
                  disabled={uploadFile.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File list */}
      {hasFiles ? (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="text-muted-foreground h-5 w-5 shrink-0" />
                  <div className="min-w-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary truncate text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {file.description || 'Sin descripción'}
                    </a>
                    <p className="text-muted-foreground text-xs">
                      {formatDateOnly(file.createdAt, 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteFile.isPending}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
              <p className="text-muted-foreground">No hay documentos adjuntos</p>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmationDialog />
    </div>
  );
}
