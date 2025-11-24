'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, FileText, Briefcase, CreditCard } from 'lucide-react';

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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { FormDialog } from '@/shared/components/form-dialog';

import { useCreateParticipant } from '../hooks/use-create-participant';
import { useUpdateParticipant } from '../hooks/use-update-participant';
import {
  createParticipantSchema,
  updateParticipantSchema,
  type CreateParticipantFormData,
  type UpdateParticipantFormData,
} from '../lib/validation';
import { ParticipantType, DocumentType } from '../types';
import { PARTICIPANT_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../constants';
import type { Participant } from '../types';

interface ParticipantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant?: Participant | null;
}

export function ParticipantFormDialog({
  open,
  onOpenChange,
  participant,
}: ParticipantFormDialogProps) {
  const isEditing = !!participant;
  const { mutate: createParticipant, isPending: isCreating } = useCreateParticipant();
  const { mutate: updateParticipant, isPending: isUpdating } = useUpdateParticipant();

  const form = useForm<CreateParticipantFormData | UpdateParticipantFormData>({
    resolver: zodResolver(isEditing ? updateParticipantSchema : createParticipantSchema),
    defaultValues:
      isEditing && participant
        ? {
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email || '',
            document: participant.document,
            documentType: participant.documentType,
            phone: participant.phone,
            address: participant.address,
            participantType: participant.participantType,
            isActive: participant.isActive,
          }
        : {
            firstName: '',
            lastName: '',
            email: '',
            document: '',
            documentType: DocumentType.DNI,
            phone: '',
            address: '',
            participantType: ParticipantType.TELEMARKETER,
          },
  });

  // Reset form cuando cambia el participant o se abre/cierra
  useEffect(() => {
    if (open) {
      if (isEditing && participant) {
        form.reset({
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email || '',
          document: participant.document,
          documentType: participant.documentType,
          phone: participant.phone,
          address: participant.address,
          participantType: participant.participantType,
          isActive: participant.isActive,
        });
      } else {
        form.reset({
          firstName: '',
          lastName: '',
          email: '',
          document: '',
          documentType: DocumentType.DNI,
          phone: '',
          address: '',
          participantType: ParticipantType.TELEMARKETER,
        });
      }
    }
  }, [open, participant, isEditing, form]);

  const onSubmit = (data: CreateParticipantFormData | UpdateParticipantFormData) => {
    if (isEditing && participant) {
      updateParticipant(
        { id: participant.id, data: data as UpdateParticipantFormData },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } else {
      createParticipant(data as CreateParticipantFormData, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar participante' : 'Crear nuevo participante'}
      description={
        isEditing
          ? 'Actualiza la información del participante'
          : 'Completa el formulario para crear un nuevo participante'
      }
      isEditing={isEditing}
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth="lg"
    >
      <Form {...form}>
        {/* Nombres */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5" />
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Juan"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground text-sm font-medium">Apellido</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pérez"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-3.5 w-3.5" />
                Correo electrónico (opcional)
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="focus-visible:ring-primary/30 h-9 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documento */}
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <FileText className="h-3.5 w-3.5" />
                  Tipo
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus:ring-primary/30 h-9 transition-all">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem className="col-span-2 space-y-1.5">
                <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5" />
                  Número de documento
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678"
                    className="focus-visible:ring-primary/30 h-9 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <Phone className="h-3.5 w-3.5" />
                Teléfono
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="987654321"
                  className="focus-visible:ring-primary/30 h-9 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dirección */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="h-3.5 w-3.5" />
                Dirección
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Av. Principal 123, Distrito"
                  className="focus-visible:ring-primary/30 h-9 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de participante */}
        <FormField
          control={form.control}
          name="participantType"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                <Briefcase className="h-3.5 w-3.5" />
                Tipo de participante
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="focus:ring-primary/30 h-9 transition-all">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PARTICIPANT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado (solo en edición) */}
        {isEditing && (
          <>
            <Separator className="my-1" />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="bg-muted/30 border-border/50 hover:bg-muted/40 flex flex-row items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm transition-colors">
                  <div className="space-y-0.5">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Estado del participante
                    </FormLabel>
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      {field.value ? (
                        <>
                          <div className="bg-success h-1.5 w-1.5 rounded-full" />
                          <span>Participante activo</span>
                        </>
                      ) : (
                        <>
                          <div className="bg-destructive h-1.5 w-1.5 rounded-full" />
                          <span>Participante inactivo</span>
                        </>
                      )}
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
      </Form>
    </FormDialog>
  );
}
