import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import { Separator } from '@/components/ui/separator';
import { CreateUpdateLeadDto, DocumentType, Lead } from '@/types/leads.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Calendar, Mail, Phone, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
const contactFormSchema = z.object({
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
    required_error: 'El tipo de documento es requerido'
  }),
  email: z.string().email('El email debe tener un formato válido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  phone2: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono alternativo debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  age: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => !val || (val >= 18 && val <= 120), {
      message: 'La edad debe estar entre 18 y 120 años'
    })
    .optional(),
  sourceId: z.string().optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
  provinceId: z.string().optional().or(z.literal('')),
  ubigeoId: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
    .optional()
    .or(z.literal(''))
});
type ContactFormValues = z.infer<typeof contactFormSchema>;
interface LeadEditFormProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: CreateUpdateLeadDto, id: string) => Promise<boolean>;
  isUpdating: boolean;
  error: string | null;
}
export default function LeadEditForm({
  lead,
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  error
}: LeadEditFormProps) {
  const form = useForm<CreateUpdateLeadDto>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      document: lead.document,
      documentType: lead.documentType,
      email: lead?.email || '',
      phone: lead?.phone || '',
      phone2: lead?.phone2 || '',
      age: lead?.age || undefined,
      isNewLead: false
    },
    mode: 'onBlur'
  });
  useEffect(() => {
    if (lead && isOpen) {
      form.reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || '',
        phone: lead.phone || '',
        phone2: lead.phone2 || '',
        age: lead.age || undefined,
        document: lead.document,
        documentType: lead.documentType,
        isNewLead: false
      });
    }
  }, [lead, form, isOpen]);
  const onSubmit = async (values: ContactFormValues) => {
    const contactData: CreateUpdateLeadDto = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      phone2: values.phone2 || undefined,
      document: lead.document,
      documentType: lead.documentType,
      isNewLead: false,
      age: values.age || undefined
    };
    const success = await onUpdate(contactData, lead.id);
    if (success) {
      onClose();
    }
  };
  if (!lead) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <User className="h-5 w-5" />
            Editar información de contacto
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="text-destructive h-4 w-4" />
                  <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Nombre del lead"
                              {...field}
                              disabled
                              className="pl-9"
                            />
                            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Apellido del lead"
                              {...field}
                              disabled
                              className="pl-9"
                            />
                            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="correo@ejemplo.com"
                              type="email"
                              {...field}
                              className="pl-9"
                            />
                            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Edad"
                              type="number"
                              min="18"
                              max="120"
                              {...field}
                              className="pl-9"
                            />
                            <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <h3 className="text-md font-medium">Teléfonos de contacto</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono principal</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="99999999" {...field} className="pl-9" />
                            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono alternativo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="99999999" {...field} className="pl-9" />
                            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
