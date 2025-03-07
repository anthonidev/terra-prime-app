import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
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
import {
  AlertCircle,
  Building2,
  Layers,
  Check,
  Milestone,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    data: { name?: string; isActive?: boolean },
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
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStageStats = () => {
    if (!stage) return null;
    const blockCount = stage.blocks.length;
    const lotCount = stage.blocks.reduce(
      (total, block) => total + block.lotCount,
      0,
    );
    const activeBlockCount = stage.blocks.filter(
      (block) => block.isActive,
    ).length;
    return { blockCount, lotCount, activeBlockCount };
  };
  const stats = isEditMode ? getStageStats() : null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              {isEditMode ? (
                <Layers className="h-5 w-5 text-primary" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <span>{isEditMode ? "Editar Etapa" : "Nueva Etapa"}</span>
            {isEditMode && stage && (
              <Badge
                variant={stage.isActive ? "default" : "secondary"}
                className="ml-2"
              >
                {stage.isActive ? "Activa" : "Inactiva"}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-1 -mx-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 pt-2"
            >
              {}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="bg-destructive/10 border-destructive/20"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {}
              {isEditMode && stage && stats && (
                <div className="bg-muted/20 rounded-md p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-primary" />
                      Información de la etapa
                    </h3>
                    <Badge variant="outline" className="bg-secondary/10">
                      ID: {stage.id.substring(0, 8)}...
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-primary/5 p-2 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">Manzanas</p>
                      <p className="font-medium text-sm">{stats.blockCount}</p>
                    </div>
                    <div className="bg-primary/5 p-2 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">Lotes</p>
                      <p className="font-medium text-sm">{stats.lotCount}</p>
                    </div>
                    <div className="bg-primary/5 p-2 rounded-md text-center">
                      <p className="text-xs text-muted-foreground">Activas</p>
                      <p className="font-medium text-sm">
                        {stats.activeBlockCount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Nombre de la etapa</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ej. Etapa 1, Fase A, Sector Norte..."
                          {...field}
                          className="pl-9 transition-all focus:border-primary"
                        />
                        <Milestone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      El nombre debe ser único dentro del proyecto.
                    </p>
                  </FormItem>
                )}
              />
              {}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="bg-secondary/10 rounded-lg border p-4 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Estado de la etapa
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value
                            ? "La etapa es visible y disponible para asignar manzanas"
                            : "La etapa está oculta y no se pueden asignar nuevas manzanas"}
                        </div>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${field.value ? "text-muted-foreground" : "font-medium"}`}
                          >
                            Inactiva
                          </span>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                          <span
                            className={`text-sm ${field.value ? "font-medium" : "text-muted-foreground"}`}
                          >
                            Activa
                          </span>
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              {}
              {!isEditMode && (
                <div className="bg-primary/5 rounded-md p-3 text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Consejos para la creación de etapas</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>
                      Utiliza nombres descriptivos para identificar fácilmente
                      las etapas
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>
                      Las etapas suelen representar fases o sectores del
                      proyecto
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>
                      Una vez creada la etapa, podrás añadir manzanas dentro de
                      ella
                    </span>
                  </p>
                </div>
              )}
              {}
              {isEditMode && stage && stats && stats.blockCount > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md p-3 text-amber-800 dark:text-amber-300">
                  <p className="flex items-center gap-1.5 text-sm font-medium mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Advertencia</span>
                  </p>
                  <p className="text-xs">
                    Esta etapa contiene {stats.blockCount} manzana
                    {stats.blockCount !== 1 ? "s" : ""} y {stats.lotCount} lote
                    {stats.lotCount !== 1 ? "s" : ""}. Cambiar su estado a
                    {`Inactiva`} ocultará todas las manzanas y lotes asociados
                    en las vistas públicas.
                  </p>
                </div>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter className="border-t pt-3 mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-9"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            ) : isEditMode ? (
              "Actualizar etapa"
            ) : (
              "Crear etapa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
