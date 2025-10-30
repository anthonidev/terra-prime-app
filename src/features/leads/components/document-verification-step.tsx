'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOCUMENT_TYPES } from '../constants';
import type { DocumentType } from '../types';

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
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Verificación de Documento</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo de Documento</Label>
          <Select value={documentType} onValueChange={onDocumentTypeChange}>
            <SelectTrigger id="documentType">
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
          <Label htmlFor="document">Número de Documento</Label>
          <Input
            id="document"
            value={document}
            onChange={(e) => onDocumentChange(e.target.value)}
            placeholder="Ingrese el número de documento"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onSearch} disabled={!document || !documentType || isSearching}>
            {isSearching ? 'Verificando...' : 'Verificar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
