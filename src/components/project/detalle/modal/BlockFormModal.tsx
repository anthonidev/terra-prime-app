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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BlockDetailDto, StageDetailDto } from "@/types/project.types";
import { AlertCircle, Building2, Grid } from "lucide-react";

// Esquema de validación con zod
const blockSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message:
        "El nombre solo debe contener letras, números, espacios y guiones",
    }),
  isActive: z.boolean().default(true),
  stageId: z.string({
    required_error: "Debe seleccionar una etapa",
  }),
});

type BlockFormValues = z.infer<typeof blockSchema>;

interface BlockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  block?: BlockDetailDto | null;
  stages: StageDetailDto[];
  preselectedStageId?: string;
  onCreateBlock: (data: {
    name: string;
    isActive?: boolean;
    stageId: string;
  }) => Promise<void>;
  onUpdateBlock: (
    blockId: string,
    data: { name?: string; isActive?: boolean }
  ) => Promise<void>;
  error: string | null;
}

export default function BlockFormModal({
  isOpen,
  onClose,
  block,
  stages,
  preselectedStageId,
  onCreateBlock,
  onUpdateBlock,
  error,
}: BlockFormModalProps) {
  const isEditMode = !!block;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: block?.name || "",
      isActive: block?.isActive ?? true,
      stageId: block?.stageId || preselectedStageId || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: block?.name || "",
        isActive: block?.isActive ?? true,
        stageId: block?.stageId || preselectedStageId || "",
      });
    }
  }, [block, form, isOpen, preselectedStageId]);

  const onSubmit = async (values: BlockFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && block) {
        await onUpdateBlock(block.id, {
          name: values.name,
          isActive: values.isActive,
        });
      } else {
        await onCreateBlock({
          name: values.name,
          isActive: values.isActive,
          stageId: values.stageId,
        });
      }
      onClose();
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} la manzana:`,
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
                <Building2 className="h-5 w-5" />
                Editar Manzana
              </>
            ) : (
              <>
                <Grid className="h-5 w-5" />
                Nueva Manzana
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
                  <FormLabel>Nombre de la manzana</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. A, B, Manzana 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditMode && (
              <FormField
                control={form.control}
                name="stageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar etapa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Estado de la manzana</FormLabel>
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
