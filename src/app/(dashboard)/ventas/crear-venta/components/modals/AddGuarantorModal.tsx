'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertCircle,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  UserCheck,
  X
} from 'lucide-react';

import { GuarantorFormData, guarantorSchema } from '../../validations/saleValidation';

interface AddGuarantorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: GuarantorFormData) => void;
  isCreating: boolean;
}

export default function AddGuarantorModal({
  isOpen,
  onClose,
  onSuccess,
  isCreating
}: AddGuarantorModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GuarantorFormData>({
    resolver: zodResolver(guarantorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      document: '',
      documentType: 'DNI',
      phone: '',
      address: ''
    }
  });

  const onSubmit = async (data: GuarantorFormData) => {
    setError(null);
    try {
      await onSuccess(data);
      form.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el garante';
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      form.reset();
      setError(null);
      onClose();
    }
  };

  const documentTypeOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'CE' },
    { value: 'RUC', label: 'RUC' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex h-[90vh] max-h-[700px] w-[95vw] max-w-md flex-col p-0 sm:h-auto sm:max-h-[85vh]">
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Agregar Garante</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registra la información del garante (aval) para la venta
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Nombre del garante"
                            className="h-10 pl-9"
                            {...field}
                            disabled={isCreating}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Apellido</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Apellido del garante"
                            className="h-10 pl-9"
                            {...field}
                            disabled={isCreating}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="email@ejemplo.com"
                          className="h-10 pl-9"
                          {...field}
                          disabled={isCreating}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tipo de Documento</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isCreating}
                      >
                        <SelectTrigger className="h-10">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                            <SelectValue placeholder="Seleccionar tipo" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Número de Documento</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Número de documento"
                            className="h-10 pl-9"
                            {...field}
                            disabled={isCreating}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Número de teléfono"
                          className="h-10 pl-9"
                          {...field}
                          disabled={isCreating}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Dirección</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Dirección completa"
                          className="h-10 pl-9"
                          {...field}
                          disabled={isCreating}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            size="sm"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isCreating || !form.formState.isValid}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            size="sm"
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Garante
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
