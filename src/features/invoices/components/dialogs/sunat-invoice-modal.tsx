'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateInvoice } from '../../hooks/use-create-invoice';
import {
  DocumentType,
  DocumentTypeLabels,
  ClientDocumentType,
  ClientDocumentTypeLabels,
  type CreateInvoiceInput,
  type Invoice,
} from '../../types';
import type { PaymentDetail } from '@/features/payments/types';

interface SunatInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentDetail;
  onSuccess?: (invoice: Invoice) => void;
}

interface FormData {
  documentType: DocumentType | null;
  clientDocumentType: ClientDocumentType | null;
  clientDocumentNumber: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  observations: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export function SunatInvoiceModal({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: SunatInvoiceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    documentType: null,
    clientDocumentType: null,
    clientDocumentNumber: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    observations: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens and pre-fill with client data
  useEffect(() => {
    if (open) {
      // Generate default observations based on payment info
      const paymentType = payment.paymentConfig?.name || 'Pago';
      const lotInfo = payment.lot
        ? `Lote: ${payment.lot.name || ''} ${payment.lot.block ? `- Mz. ${payment.lot.block}` : ''} ${payment.lot.stage ? `- Etapa ${payment.lot.stage}` : ''} ${payment.lot.project ? `- ${payment.lot.project}` : ''}`
        : '';
      const defaultObservations = `${paymentType}${lotInfo ? ` - ${lotInfo}` : ''}`;

      // Get client data from payment
      const client = payment.client;
      const clientDocType = client?.documentType;

      // Determine document type and client document type based on client's document type
      // Only consider DNI and RUC, ignore CE (Carnet de Extranjería)
      let defaultDocumentType: DocumentType | null = null;
      let defaultClientDocumentType: ClientDocumentType | null = null;

      if (clientDocType === 'DNI') {
        defaultDocumentType = DocumentType.RECEIPT; // Boleta for DNI
        defaultClientDocumentType = ClientDocumentType.DNI;
      } else if (clientDocType === 'RUC') {
        defaultDocumentType = DocumentType.INVOICE; // Factura for RUC
        defaultClientDocumentType = ClientDocumentType.RUC;
      }

      // Build client name from lead data
      const clientName = client?.lead
        ? `${client.lead.firstName || ''} ${client.lead.lastName || ''}`.trim()
        : '';

      setFormData({
        documentType: defaultDocumentType,
        clientDocumentType: defaultClientDocumentType,
        clientDocumentNumber: client?.lead?.document || '',
        clientName: clientName,
        clientAddress: client?.address || '',
        clientEmail: client?.email || '',
        observations: defaultObservations,
      });
      setErrors({});
    }
  }, [open, payment]);

  const { mutate, isPending } = useCreateInvoice({
    onSuccess: (invoice) => {
      onOpenChange(false);
      onSuccess?.(invoice);
    },
  });

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // When document type changes, auto-select the corresponding client document type
      if (field === 'documentType') {
        if (value === DocumentType.INVOICE) {
          // Factura requires RUC
          newData.clientDocumentType = ClientDocumentType.RUC;
        } else if (value === DocumentType.RECEIPT) {
          // Boleta requires DNI
          newData.clientDocumentType = ClientDocumentType.DNI;
        }
        // Clear document number when type changes
        newData.clientDocumentNumber = '';
      }

      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear client document type error when document type changes
    if (field === 'documentType' && errors.clientDocumentType) {
      setErrors((prev) => ({ ...prev, clientDocumentType: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.documentType === null) {
      newErrors.documentType = 'El tipo de documento es requerido';
    }

    if (formData.clientDocumentType === null) {
      newErrors.clientDocumentType = 'El tipo de documento del cliente es requerido';
    }

    if (!formData.clientDocumentNumber.trim()) {
      newErrors.clientDocumentNumber = 'El número de documento es requerido';
    } else if (formData.clientDocumentType === ClientDocumentType.DNI) {
      if (!/^\d{8}$/.test(formData.clientDocumentNumber.trim())) {
        newErrors.clientDocumentNumber = 'El DNI debe tener 8 dígitos';
      }
    } else if (formData.clientDocumentType === ClientDocumentType.RUC) {
      if (!/^\d{11}$/.test(formData.clientDocumentNumber.trim())) {
        newErrors.clientDocumentNumber = 'El RUC debe tener 11 dígitos';
      }
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    if (formData.clientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'El correo electrónico no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData: CreateInvoiceInput = {
      documentType: formData.documentType as DocumentType,
      clientDocumentType: formData.clientDocumentType as ClientDocumentType,
      clientDocumentNumber: formData.clientDocumentNumber.trim(),
      clientName: formData.clientName.trim(),
      paymentId: payment.id,
    };

    if (formData.clientAddress.trim()) {
      submitData.clientAddress = formData.clientAddress.trim();
    }

    if (formData.clientEmail.trim()) {
      submitData.clientEmail = formData.clientEmail.trim();
    }

    if (formData.observations.trim()) {
      submitData.observations = formData.observations.trim();
    }

    mutate(submitData);
  };

  const handleClose = () => {
    if (!isPending) {
      setFormData({
        documentType: null,
        clientDocumentType: null,
        clientDocumentNumber: '',
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        observations: '',
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            Enviar a SUNAT
          </DialogTitle>
          <DialogDescription>
            Completa los datos para generar el comprobante electrónico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tipo de Documento */}
          <div className="space-y-2">
            <Label htmlFor="documentType">
              Tipo de Comprobante <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.documentType !== null ? String(formData.documentType) : ''}
              onValueChange={(value) => handleChange('documentType', Number(value) as DocumentType)}
              disabled={isPending}
            >
              <SelectTrigger
                id="documentType"
                className={`w-full ${errors.documentType ? 'border-destructive' : ''}`}
              >
                <SelectValue placeholder="Seleccionar tipo de comprobante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(DocumentType.INVOICE)}>
                  {DocumentTypeLabels[DocumentType.INVOICE]}
                </SelectItem>
                <SelectItem value={String(DocumentType.RECEIPT)}>
                  {DocumentTypeLabels[DocumentType.RECEIPT]}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.documentType && (
              <p className="text-destructive text-xs">{errors.documentType}</p>
            )}
          </div>

          {/* Separator */}
          <div className="border-border border-t pt-4">
            <h4 className="text-muted-foreground mb-3 text-sm font-medium">
              Información del Cliente
            </h4>
          </div>

          {/* Tipo de Documento del Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientDocumentType">
              Tipo de Documento <span className="text-destructive">*</span>
            </Label>
            <Select
              value={
                formData.clientDocumentType !== null ? String(formData.clientDocumentType) : ''
              }
              onValueChange={(value) =>
                handleChange('clientDocumentType', Number(value) as ClientDocumentType)
              }
              disabled={isPending || formData.documentType === null}
            >
              <SelectTrigger
                id="clientDocumentType"
                className={`w-full ${errors.clientDocumentType ? 'border-destructive' : ''}`}
              >
                <SelectValue
                  placeholder={
                    formData.documentType === null
                      ? 'Primero seleccione tipo de comprobante'
                      : 'Seleccionar tipo de documento'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {/* Factura -> solo RUC, Boleta -> solo DNI */}
                {formData.documentType === DocumentType.INVOICE && (
                  <SelectItem value={String(ClientDocumentType.RUC)}>
                    {ClientDocumentTypeLabels[ClientDocumentType.RUC]}
                  </SelectItem>
                )}
                {formData.documentType === DocumentType.RECEIPT && (
                  <SelectItem value={String(ClientDocumentType.DNI)}>
                    {ClientDocumentTypeLabels[ClientDocumentType.DNI]}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {formData.documentType !== null && (
              <p className="text-muted-foreground text-xs">
                {formData.documentType === DocumentType.INVOICE
                  ? 'Factura requiere RUC'
                  : 'Boleta requiere DNI'}
              </p>
            )}
            {errors.clientDocumentType && (
              <p className="text-destructive text-xs">{errors.clientDocumentType}</p>
            )}
          </div>

          {/* Número de Documento del Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientDocumentNumber">
              Número de Documento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientDocumentNumber"
              value={formData.clientDocumentNumber}
              onChange={(e) => handleChange('clientDocumentNumber', e.target.value)}
              placeholder={
                formData.clientDocumentType === ClientDocumentType.RUC
                  ? 'Ingrese el RUC (11 dígitos)'
                  : 'Ingrese el DNI (8 dígitos)'
              }
              disabled={isPending}
              className={errors.clientDocumentNumber ? 'border-destructive' : ''}
              maxLength={formData.clientDocumentType === ClientDocumentType.RUC ? 11 : 8}
            />
            {errors.clientDocumentNumber && (
              <p className="text-destructive text-xs">{errors.clientDocumentNumber}</p>
            )}
          </div>

          {/* Nombre del Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientName">
              Nombre / Razón Social <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Ingrese el nombre o razón social"
              disabled={isPending}
              className={errors.clientName ? 'border-destructive' : ''}
            />
            {errors.clientName && <p className="text-destructive text-xs">{errors.clientName}</p>}
          </div>

          {/* Dirección del Cliente (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="clientAddress">
              Dirección <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => handleChange('clientAddress', e.target.value)}
              placeholder="Ingrese la dirección"
              disabled={isPending}
            />
          </div>

          {/* Correo del Cliente (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="clientEmail">
              Correo Electrónico <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => handleChange('clientEmail', e.target.value)}
              placeholder="ejemplo@correo.com"
              disabled={isPending}
              className={errors.clientEmail ? 'border-destructive' : ''}
            />
            {errors.clientEmail && <p className="text-destructive text-xs">{errors.clientEmail}</p>}
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observations">
              Observaciones <span className="text-muted-foreground text-xs">(Opcional)</span>
            </Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observaciones adicionales"
              disabled={isPending}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generar Comprobante
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
