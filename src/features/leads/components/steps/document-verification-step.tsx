'use client';

import { CreditCard, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DOCUMENT_TYPES } from '../../constants';
import type { DocumentType } from '../../types';

interface DocumentVerificationStepProps {
  documentType: DocumentType;
  document: string;
  isSearching: boolean;
  onDocumentTypeChange: (value: DocumentType) => void;
  onDocumentChange: (value: string) => void;
  onSearch: () => void;
}

export function DocumentVerificationStep({
  documentType,
  document,
  isSearching,
  onDocumentTypeChange,
  onDocumentChange,
  onSearch,
}: DocumentVerificationStepProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <CreditCard className="text-primary h-4 w-4" />
          </div>
          <CardTitle className="text-base">Verificación de Documento</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="documentType" className="text-sm font-medium">
                Tipo de Documento
              </Label>
              <Select value={documentType} onValueChange={onDocumentTypeChange}>
                <SelectTrigger id="documentType" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">
                Número de Documento
              </Label>
              <div className="relative">
                <Input
                  id="document"
                  value={document}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      onDocumentChange(value);
                    }
                  }}
                  placeholder="Ingrese el número de documento"
                  className="h-12 text-lg tracking-wide"
                  maxLength={documentType === 'DNI' ? 8 : 12}
                />
                {document && (
                  <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                    {document.length} dígitos
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              onClick={onSearch}
              disabled={!document || !documentType || isSearching}
              className="w-full md:w-auto"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verificar Documento
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
