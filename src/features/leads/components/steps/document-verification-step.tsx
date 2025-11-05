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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Verificación de Documento</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="documentType" className="text-xs font-medium">
              Tipo de Documento
            </Label>
            <Select value={documentType} onValueChange={onDocumentTypeChange}>
              <SelectTrigger id="documentType" className="h-9 text-sm">
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

          <div className="space-y-1.5">
            <Label htmlFor="document" className="text-xs font-medium">
              Número de Documento
            </Label>
            <Input
              id="document"
              value={document}
              onChange={(e) => onDocumentChange(e.target.value)}
              placeholder="Ingrese el número de documento"
              className="h-9 text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={onSearch}
              disabled={!document || !documentType || isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-3.5 w-3.5" />
                  Verificar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
