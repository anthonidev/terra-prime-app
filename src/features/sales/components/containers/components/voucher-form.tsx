'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Upload, Building2, Hash, Calendar, DollarSign, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/lib/utils';

export interface VoucherFormData {
  bankName: string;
  transactionReference: string;
  transactionDate: string;
  amount: string;
  codeOperation: string;
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
    codeOperation?: string;
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
  const [isOtherBank, setIsOtherBank] = useState(false);

  // Predefined banks
  const BANKS = ['BBVA', 'BCP', 'INTERBANK', 'Scotiabank', 'BN', 'OTROS'];

  const handleBankChange = (value: string) => {
    if (value === 'OTROS') {
      setIsOtherBank(true);
      handleChange('bankName', '');
    } else {
      setIsOtherBank(false);
      handleChange('bankName', value);
    }
  };

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
      className="border-primary/20 from-primary/5 space-y-4 rounded-lg border-2 bg-linear-to-br to-transparent p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md">
            <FileText className="text-primary h-4 w-4" />
          </div>
          <h4 className="text-sm font-semibold">Comprobante #{index + 1}</h4>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Bank Name */}
        <div className="space-y-2">
          <Label htmlFor={`bankName-${index}`} className="flex items-center gap-2 text-sm">
            <Building2 className="text-primary h-4 w-4" />
            Banco
            <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-col gap-2">
            <Select
              value={isOtherBank ? 'OTROS' : BANKS.includes(data.bankName) ? data.bankName : ''}
              onValueChange={handleBankChange}
            >
              <SelectTrigger className={cn(errors?.bankName && 'border-destructive')}>
                <SelectValue placeholder="Seleccionar banco" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isOtherBank && (
              <Input
                type="text"
                placeholder="Ingrese el nombre del banco"
                value={data.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className={cn(errors?.bankName && 'border-destructive')}
              />
            )}
          </div>
          {errors?.bankName && <p className="text-destructive text-xs">{errors.bankName}</p>}
        </div>

        {/* Transaction Reference */}
        <div className="space-y-2">
          <Label
            htmlFor={`transactionReference-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <Hash className="text-primary h-4 w-4" />
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
            <p className="text-destructive text-xs">{errors.transactionReference}</p>
          )}
        </div>

        {/* Code Operation */}
        <div className="space-y-2">
          <Label htmlFor={`codeOperation-${index}`} className="flex items-center gap-2 text-sm">
            <Hash className="text-primary h-4 w-4" />
            Código de Operación
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`codeOperation-${index}`}
            type="text"
            placeholder="Ej: OP123456"
            value={data.codeOperation}
            onChange={(e) => handleChange('codeOperation', e.target.value)}
            className={cn(errors?.codeOperation && 'border-destructive')}
          />
          {errors?.codeOperation && (
            <p className="text-destructive text-xs">{errors.codeOperation}</p>
          )}
        </div>

        {/* Transaction Date */}
        <div className="space-y-2">
          <Label htmlFor={`transactionDate-${index}`} className="flex items-center gap-2 text-sm">
            <Calendar className="text-primary h-4 w-4" />
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
            <p className="text-destructive text-xs">{errors.transactionDate}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor={`amount-${index}`} className="flex items-center gap-2 text-sm">
            <DollarSign className="text-primary h-4 w-4" />
            Monto ({currencySymbol})<span className="text-destructive">*</span>
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
          {errors?.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor={`file-${index}`} className="flex items-center gap-2 text-sm">
          <Upload className="text-primary h-4 w-4" />
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
            <Upload className="mr-2 h-4 w-4" />
            {fileName || 'Seleccionar archivo'}
          </Button>
        </div>
        {fileName && <p className="text-muted-foreground text-xs">Archivo: {fileName}</p>}
        {errors?.file && <p className="text-destructive text-xs">{errors.file}</p>}
      </div>
    </motion.div>
  );
}
