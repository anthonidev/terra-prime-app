'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, FileText, CreditCard, Calendar } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/shared/components/form-dialog';

import { useUpdateLead } from '../../hooks/use-update-lead';
import { updateLeadSchema, type UpdateLeadFormData } from '../../lib/validation';
import type { Lead } from '../../types';

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLeadModal({ lead, isOpen, onClose }: EditLeadModalProps) {
  const updateLead = useUpdateLead(lead?.id || '');

  const form = useForm<UpdateLeadFormData>({
    resolver: zodResolver(updateLeadSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      document: '',
      documentType: 'DNI',
      email: '',
      phone: '',
      phone2: '',
      age: undefined,
      observations: '',
    },
  });

  // Load current lead data when modal opens
  useEffect(() => {
    if (lead && isOpen) {
      form.reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        document: lead.document,
        documentType: lead.documentType,
        email: lead.email || '',
        phone: lead.phone || '',
        phone2: lead.phone2 || '',
        age: lead.age || undefined,
        observations: '', // Observations usually not prefilled for editing unless specific requirement
      });
    }
  }, [lead, isOpen, form]);

  const onSubmit = async (data: UpdateLeadFormData) => {
    if (!lead) return;

    // Filter out undefined and empty string values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    ) as Partial<UpdateLeadFormData>;

    await updateLead.mutateAsync(filteredData);
    onClose();
  };

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Editar Lead"
      description="Actualiza la información personal y de contacto del lead"
      isEditing={true}
      isPending={updateLead.isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth="lg"
    >
      <Form {...form}>
        <div className="grid gap-4 md:grid-cols-2">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5" />
                  Nombre <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5" />
                  Apellido <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el apellido"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Document Type */}
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5" />
                  Tipo de Documento
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus:ring-primary/30 h-9 transition-all">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                    <SelectItem value="RUC">RUC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Document */}
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5" />
                  Documento
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el documento"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ingrese el email"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  Edad
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingrese la edad"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Phone className="h-3.5 w-3.5" />
                  Teléfono Principal
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el teléfono"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone 2 */}
          <FormField
            control={form.control}
            name="phone2"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Phone className="h-3.5 w-3.5" />
                  Teléfono Secundario
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el teléfono secundario"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observations */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <FileText className="h-3.5 w-3.5" />
                Observaciones
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ingrese observaciones adicionales"
                  className="focus-visible:ring-primary/30 min-h-[100px] transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </FormDialog>
  );
}
