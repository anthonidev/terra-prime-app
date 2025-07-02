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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import { BlockDetailDto, StageDetailDto } from '@infrastructure/types/projects/project.types';
import { AlertCircle, Building2, Grid, Check, Layers, MapPin } from 'lucide-react';
import { Badge } from '@components/ui/badge';

const blockSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message: 'El nombre solo debe contener letras, números, espacios y guiones'
    }),
  isActive: z.boolean().default(true),
  stageId: z.string({
    required_error: 'Debe seleccionar una etapa'
  })
});

type BlockFormValues = z.infer<typeof blockSchema>;

interface BlockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  block?: BlockDetailDto | null;
  stages: StageDetailDto[];
  preselectedStageId?: string;
  onCreateBlock: (data: { name: string; isActive?: boolean; stageId: string }) => Promise<void>;
  onUpdateBlock: (blockId: string, data: { name?: string; isActive?: boolean }) => Promise<void>;
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
  error
}: BlockFormModalProps) {
  const isEditMode = !!block;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: block?.name || '',
      isActive: block?.isActive ?? true,
      stageId: block?.stageId || preselectedStageId || ''
    }
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: block?.name || '',
        isActive: block?.isActive ?? true,
        stageId: block?.stageId || preselectedStageId || ''
      });
    }
  }, [block, form, isOpen, preselectedStageId]);
  const onSubmit = async (values: BlockFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && block) {
        await onUpdateBlock(block.id, {
          name: values.name,
          isActive: values.isActive
        });
      } else {
        await onCreateBlock({
          name: values.name,
          isActive: values.isActive,
          stageId: values.stageId
        });
      }
      onClose();
    } catch (error) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la manzana:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getSelectedStage = () => {
    const stageId = isEditMode ? block?.stageId : form.watch('stageId');
    return stages.find((stage) => stage.id === stageId);
  };
  const selectedStage = getSelectedStage();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-1.5">
              {isEditMode ? (
                <Building2 className="text-primary h-5 w-5" />
              ) : (
                <Grid className="text-primary h-5 w-5" />
              )}
            </div>
            <span>{isEditMode ? 'Editar Manzana' : 'Nueva Manzana'}</span>
            {isEditMode && block && (
              <Badge variant={block.isActive ? 'default' : 'secondary'} className="ml-2">
                {block.isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="-mx-1 max-h-[80vh] overflow-y-auto p-1 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {isEditMode && block && selectedStage && (
                <div className="bg-muted/20 flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-md p-1.5">
                      <Layers className="text-primary h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Etapa:</span>{' '}
                      <span className="font-medium">{selectedStage.name}</span>
                    </div>
                  </div>
                  {block.lotCount > 0 && (
                    <Badge variant="outline" className="bg-secondary/20">
                      {block.lotCount} {block.lotCount === 1 ? 'lote' : 'lotes'}
                    </Badge>
                  )}
                </div>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Nombre de la manzana</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ej. A, B, Manzana 1"
                          {...field}
                          className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                        />
                        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground mt-1 text-xs">
                      El nombre debe ser único dentro de la etapa.
                    </p>
                  </FormItem>
                )}
              />
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="stageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <span>Etapa</span>
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <SelectTrigger className="bg-white pl-9 dark:bg-gray-900">
                              <Layers className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <SelectValue placeholder="Seleccionar etapa" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {stages.map((stage) => (
                            <SelectItem
                              key={stage.id}
                              value={stage.id}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{stage.name}</span>
                                {!stage.isActive && (
                                  <Badge variant="secondary" className="text-xs">
                                    Inactiva
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="rounded-lg border bg-white p-4 transition-all dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Estado de la manzana</FormLabel>
                        <div className="text-muted-foreground text-sm">
                          {field.value
                            ? 'La manzana es visible y disponible para asignar lotes'
                            : 'La manzana está oculta y no se pueden asignar nuevos lotes'}
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
              <div className="bg-primary/5 text-muted-foreground space-y-1 rounded-md p-3 text-xs">
                <p className="text-primary mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <Check className="h-3.5 w-3.5" />
                  <span>Consejos para la creación de manzanas</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Utiliza nombres cortos y fáciles de identificar</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Los nombres pueden ser letras (A, B, C) o números (1, 2, 3)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Una vez creada la manzana, podrás añadir lotes a la misma</span>
                </p>
              </div>
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
              'Actualizar manzana'
            ) : (
              'Crear manzana'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
