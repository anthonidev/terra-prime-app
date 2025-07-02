import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Switch } from '@components/ui/switch';
import { AlertCircle, Building2, Layers, Check, Milestone, Info } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { StageDetailDto } from '@infrastructure/types/projects/project.types';

const stageSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message: 'El nombre solo debe contener letras, números, espacios y guiones'
    }),
  isActive: z.boolean().default(true)
});

type StageFormValues = z.infer<typeof stageSchema>;

interface StageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage?: StageDetailDto | null;
  onCreateStage: (data: { name: string; isActive?: boolean }) => Promise<void>;
  onUpdateStage: (stageId: string, data: { name?: string; isActive?: boolean }) => Promise<void>;
  error: string | null;
}
export default function StageFormModal({
  isOpen,
  onClose,
  stage,
  onCreateStage,
  onUpdateStage,
  error
}: StageFormModalProps) {
  const isEditMode = !!stage;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: stage?.name || '',
      isActive: stage?.isActive ?? true
    }
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: stage?.name || '',
        isActive: stage?.isActive ?? true
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
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la etapa:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStageStats = () => {
    if (!stage) return null;
    const blockCount = stage.blocks.length;
    const lotCount = stage.blocks.reduce((total, block) => total + block.lotCount, 0);
    const activeBlockCount = stage.blocks.filter((block) => block.isActive).length;
    return { blockCount, lotCount, activeBlockCount };
  };
  const stats = isEditMode ? getStageStats() : null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-1.5">
              {isEditMode ? (
                <Layers className="text-primary h-5 w-5" />
              ) : (
                <Building2 className="text-primary h-5 w-5" />
              )}
            </div>
            <span>{isEditMode ? 'Editar Etapa' : 'Nueva Etapa'}</span>
            {isEditMode && stage && (
              <Badge variant={stage.isActive ? 'default' : 'secondary'} className="ml-2">
                {stage.isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="-mx-1 max-h-[80vh] overflow-y-auto p-1 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
              {}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {}
              {isEditMode && stage && stats && (
                <div className="bg-muted/20 mb-4 rounded-md p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-sm font-medium">
                      <Info className="text-primary h-4 w-4" />
                      Información de la etapa
                    </h3>
                    <Badge variant="outline" className="bg-secondary/10">
                      ID: {stage.id.substring(0, 8)}...
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-primary/5 rounded-md p-2 text-center">
                      <p className="text-muted-foreground text-xs">Manzanas</p>
                      <p className="text-sm font-medium">{stats.blockCount}</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 text-center">
                      <p className="text-muted-foreground text-xs">Lotes</p>
                      <p className="text-sm font-medium">{stats.lotCount}</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 text-center">
                      <p className="text-muted-foreground text-xs">Activas</p>
                      <p className="text-sm font-medium">{stats.activeBlockCount}</p>
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
                          className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                        />
                        <Milestone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground mt-1 text-xs">
                      El nombre debe ser único dentro del proyecto.
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="rounded-lg border bg-white p-4 transition-all dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Estado de la etapa</FormLabel>
                        <div className="text-muted-foreground text-sm">
                          {field.value
                            ? 'La etapa es visible y disponible para asignar manzanas'
                            : 'La etapa está oculta y no se pueden asignar nuevas manzanas'}
                        </div>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${field.value ? 'text-muted-foreground' : 'font-medium'}`}
                          >
                            Inactiva
                          </span>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                          <span
                            className={`text-sm ${field.value ? 'font-medium' : 'text-muted-foreground'}`}
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
                <div className="bg-primary/5 text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                  <p className="text-primary mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Check className="h-3.5 w-3.5" />
                    <span>Consejos para la creación de etapas</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Utiliza nombres descriptivos para identificar fácilmente las etapas</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Las etapas suelen representar fases o sectores del proyecto</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Una vez creada la etapa, podrás añadir manzanas dentro de ella</span>
                  </p>
                </div>
              )}
              {}
              {isEditMode && stage && stats && stats.blockCount > 0 && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                  <p className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <span>Advertencia</span>
                  </p>
                  <p className="text-xs">
                    Esta etapa contiene {stats.blockCount} manzana
                    {stats.blockCount !== 1 ? 's' : ''} y {stats.lotCount} lote
                    {stats.lotCount !== 1 ? 's' : ''}. Cambiar su estado a{`Inactiva`} ocultará
                    todas las manzanas y lotes asociados en las vistas públicas.
                  </p>
                </div>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter className="mt-3 flex justify-end gap-2 border-t pt-3">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
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
            ) : isEditMode ? (
              'Actualizar etapa'
            ) : (
              'Crear etapa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
