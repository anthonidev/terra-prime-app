import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StageDetailDto } from "@/types/project.types";
import { AlertCircle, Building2, Layers } from "lucide-react";
const stageSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message:
        "El nombre solo debe contener letras, números, espacios y guiones",
    }),
  isActive: z.boolean().default(true),
});
type StageFormValues = z.infer<typeof stageSchema>;
interface StageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage?: StageDetailDto | null;
  onCreateStage: (data: { name: string; isActive?: boolean }) => Promise<void>;
  onUpdateStage: (
    stageId: string,
    data: { name?: string; isActive?: boolean }
  ) => Promise<void>;
  error: string | null;
}
export default function StageFormModal({
  isOpen,
  onClose,
  stage,
  onCreateStage,
  onUpdateStage,
  error,
}: StageFormModalProps) {
  const isEditMode = !!stage;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: stage?.name || "",
      isActive: stage?.isActive ?? true,
    },
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: stage?.name || "",
        isActive: stage?.isActive ?? true,
      });
    }
  }, [stage, form, isOpen]);
  const onSubmit = async (values: StageFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && stage) {
        await onUpdateStage(stage.id, values);
      } else {
        await onCreateStage(values);
      }
      onClose();
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} la etapa:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Layers className="h-5 w-5" />
                Editar Etapa
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5" />
                Nueva Etapa
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la etapa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Etapa 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Estado de la etapa</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "Activa" : "Inactiva"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : isEditMode
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
