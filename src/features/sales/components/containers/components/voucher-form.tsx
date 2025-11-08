'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Upload, Building2, Hash, Calendar, DollarSign, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

export interface VoucherFormData {
  bankName: string;
  transactionReference: string;
  transactionDate: string;
  amount: string;
  file: File | null;
}

interface VoucherFormProps {
  index: number;
  data: VoucherFormData;
  onChange: (index: number, data: VoucherFormData) => void;
  onRemove: (index: number) => void;
  currencySymbol: string;
  errors?: {
    bankName?: string;
    transactionReference?: string;
    transactionDate?: string;
    amount?: string;
    file?: string;
  };
}

export function VoucherForm({
  index,
  data,
  onChange,
  onRemove,
  currencySymbol,
  errors,
}: VoucherFormProps) {
  const [fileName, setFileName] = useState<string>(data.file?.name || '');

  const handleChange = (field: keyof VoucherFormData, value: string | File | null) => {
    onChange(index, { ...data, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      handleChange('file', file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <h4 className="font-semibold text-sm">Comprobante #{index + 1}</h4>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank Name */}
        <div className="space-y-2">
          <Label htmlFor={`bankName-${index}`} className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-primary" />
            Banco (Opcional)
          </Label>
          <Input
            id={`bankName-${index}`}
            type="text"
            placeholder="Nombre del banco"
            value={data.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            className={cn(errors?.bankName && 'border-destructive')}
          />
          {errors?.bankName && (
            <p className="text-xs text-destructive">{errors.bankName}</p>
          )}
        </div>

        {/* Transaction Reference */}
        <div className="space-y-2">
          <Label htmlFor={`transactionReference-${index}`} className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-primary" />
            Referencia de Transacción
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`transactionReference-${index}`}
            type="text"
            placeholder="Ej: REF123456"
            value={data.transactionReference}
            onChange={(e) => handleChange('transactionReference', e.target.value)}
            className={cn(errors?.transactionReference && 'border-destructive')}
          />
          {errors?.transactionReference && (
            <p className="text-xs text-destructive">{errors.transactionReference}</p>
          )}
        </div>

        {/* Transaction Date */}
        <div className="space-y-2">
          <Label htmlFor={`transactionDate-${index}`} className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            Fecha de Transacción
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`transactionDate-${index}`}
            type="date"
            value={data.transactionDate}
            onChange={(e) => handleChange('transactionDate', e.target.value)}
            className={cn(errors?.transactionDate && 'border-destructive')}
          />
          {errors?.transactionDate && (
            <p className="text-xs text-destructive">{errors.transactionDate}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor={`amount-${index}`} className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-primary" />
            Monto ({currencySymbol})
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`amount-${index}`}
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={data.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className={cn(errors?.amount && 'border-destructive')}
          />
          {errors?.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor={`file-${index}`} className="flex items-center gap-2 text-sm">
          <Upload className="h-4 w-4 text-primary" />
          Comprobante
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id={`file-${index}`}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`file-${index}`)?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {fileName || 'Seleccionar archivo'}
          </Button>
        </div>
        {fileName && (
          <p className="text-xs text-muted-foreground">Archivo: {fileName}</p>
        )}
        {errors?.file && (
          <p className="text-xs text-destructive">{errors.file}</p>
        )}
      </div>
    </motion.div>
  );
}
