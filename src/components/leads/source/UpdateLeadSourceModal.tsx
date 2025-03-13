import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, FileText, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import FormInputField from "@/components/common/form/FormInputField";

interface LeadSource {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadSource: LeadSource;
  onUpdate: (
    id: number,
    data: { name?: string; isActive?: boolean }
  ) => Promise<any>;
}

const updateLeadSourceSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),

  isActive: z.boolean(),
});

type UpdateLeadSourceFormData = z.infer<typeof updateLeadSourceSchema>;

export default function UpdateLeadSourceModal({
  isOpen,
  onClose,
  leadSource,
  onUpdate,
}: UpdateLeadSourceModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateLeadSourceFormData>({
    resolver: zodResolver(updateLeadSourceSchema),
    defaultValues: {
      name: leadSource.name,
      isActive: leadSource.isActive,
    },
  });

  // Actualizar el formulario cuando cambie la fuente de lead seleccionada
  useEffect(() => {
    if (isOpen && leadSource) {
      form.reset({
        name: leadSource.name,
        isActive: leadSource.isActive,
      });
    }
  }, [isOpen, leadSource, form]);

  const onSubmit = async (data: UpdateLeadSourceFormData) => {
    try {
      setError(null);
      await onUpdate(leadSource.id, data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la fuente de lead"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Editar Fuente de Lead
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />

        {error && (
          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/30"
          >
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/20 p-3 rounded-md text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              ID: {leadSource.id} | Creado: {formatDate(leadSource.createdAt)}
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto pr-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInputField<UpdateLeadSourceFormData>
                  name="name"
                  label="Nombre"
                  placeholder="Nombre de la fuente"
                  icon={<FileText className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Estado</label>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("isActive") ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                  <Switch
                    checked={form.watch("isActive")}
                    onCheckedChange={(checked) =>
                      form.setValue("isActive", checked)
                    }
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
            disabled={form.formState.isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
