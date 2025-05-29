'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, User, FileText, CreditCard, Calendar } from 'lucide-react';
import FormInputField from '@/components/common/form/FormInputField';
import FormSelectField from '@/components/common/form/FormSelectField';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DocumentType, Liner } from '@/types/leads.types';
import { updateLiner } from '../../action';

const updateLinerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios'
    }),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El apellido solo debe contener letras y espacios'
    }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  documentType: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: 'El tipo de documento es requerido' })
  }),
  isActive: z.boolean()
});

type UpdateLinerFormData = z.infer<typeof updateLinerSchema>;

interface UpdateLinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  liner: Liner;
}

export default function UpdateLinerModal({ isOpen, onClose, liner }: UpdateLinerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateLinerFormData>({
    resolver: zodResolver(updateLinerSchema),
    defaultValues: {
      firstName: liner.firstName,
      lastName: liner.lastName,
      document: liner.document,
      documentType: liner.documentType,
      isActive: liner.isActive
    }
  });

  // Actualizar valores del formulario cuando cambie el liner
  useEffect(() => {
    if (isOpen && liner) {
      form.reset({
        firstName: liner.firstName,
        lastName: liner.lastName,
        document: liner.document,
        documentType: liner.documentType,
        isActive: liner.isActive
      });
    }
  }, [isOpen, liner, form]);

  const onSubmit = async (data: UpdateLinerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateLiner(liner.id, data);

      if (result.success) {
        toast.success('Liner actualizado correctamente');
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar el liner');
        toast.error(result.error || 'Error al actualizar el liner');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el liner';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentTypeOptions = [
    { value: DocumentType.DNI, label: 'DNI' },
    { value: DocumentType.CE, label: 'CE' },
    { value: DocumentType.RUC, label: 'RUC' }
  ];

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-md flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5" />
            Editar Liner
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="text-destructive h-4 w-4" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}
        <div className="bg-muted/20 rounded-md p-3 text-sm">
          <div className="text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              ID: {liner.id.substring(0, 8)}... | Creado: {formatDate(liner.createdAt)}
            </span>
          </div>
        </div>
        <ScrollArea className="mt-4 flex-1 overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInputField<UpdateLinerFormData>
                  name="firstName"
                  label="Nombre"
                  placeholder="Nombre del liner"
                  icon={<User className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
                <FormInputField<UpdateLinerFormData>
                  name="lastName"
                  label="Apellido"
                  placeholder="Apellido del liner"
                  icon={<User className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
                <FormInputField<UpdateLinerFormData>
                  name="document"
                  label="Documento"
                  placeholder="Número de documento"
                  icon={<FileText className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
                <FormSelectField<UpdateLinerFormData>
                  name="documentType"
                  label="Tipo de Documento"
                  placeholder="Seleccionar tipo"
                  options={documentTypeOptions}
                  icon={<CreditCard className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Estado</label>
                    <p className="text-muted-foreground text-sm">
                      {form.watch('isActive') ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  />
                </div>
              </div>
              <Separator />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="border-input hover:bg-accent"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
