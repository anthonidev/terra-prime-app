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

import {
  AlertCircle,
  MapPin,
  DollarSign,
  Building,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Check,
  Activity,
  SquareFunctionIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  LotResponseDto,
  LotStatus,
  StageDetailDto
} from '@/lib/infrastructure/types/projects/project.types';

const lotSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre debe tener al menos 1 caracter')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message: 'El nombre solo debe contener letras, números, espacios y guiones'
    }),
  area: z.coerce.number().min(0.01, 'El área debe ser mayor a 0'),
  lotPrice: z.coerce.number().min(0.01, 'El precio del lote debe ser mayor a 0'),
  urbanizationPrice: z.coerce
    .number()
    .min(0, 'El precio de habilitación urbana debe ser mayor o igual a 0')
    .default(0),
  status: z
    .enum(['Activo', 'Inactivo', 'Vendido', 'Separado'], {
      invalid_type_error: 'El estado debe ser válido'
    })
    .default('Activo'),
  blockId: z.string({
    required_error: 'Debe seleccionar una manzana'
  })
});

type LotFormValues = z.infer<typeof lotSchema>;

interface LotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot?: LotResponseDto | null;
  stages?: StageDetailDto[];
  preselectedBlockId?: string;
  onCreateLot: (data: {
    name: string;
    area: number;
    lotPrice: number;
    urbanizationPrice?: number;
    status?: LotStatus;
    blockId: string;
  }) => Promise<void>;
  onUpdateLot: (
    lotId: string,
    data: {
      name?: string;
      area?: number;
      lotPrice?: number;
      urbanizationPrice?: number;
      status?: LotStatus;
    }
  ) => Promise<void>;
  error: string | null;
}

export default function LotFormModal({
  isOpen,
  onClose,
  lot,
  stages = [],
  preselectedBlockId,
  onCreateLot,
  onUpdateLot,
  error
}: LotFormModalProps) {
  const isEditMode = !!lot;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const blockOptions = React.useMemo(() => {
    const options: {
      id: string;
      name: string;
      stageId: string;
      stageName: string;
    }[] = [];
    stages.forEach((stage) => {
      stage.blocks.forEach((block) => {
        options.push({
          id: block.id,
          name: block.name,
          stageId: stage.id,
          stageName: stage.name
        });
      });
    });
    return options.sort(
      (a, b) => a.stageName.localeCompare(b.stageName) || a.name.localeCompare(b.name)
    );
  }, [stages]);
  const form = useForm<LotFormValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      name: lot?.name || '',
      area: lot?.area || 0,
      lotPrice: lot?.lotPrice || 0,
      urbanizationPrice: lot?.urbanizationPrice || 0,
      status: (lot?.status as LotStatus) || 'Activo',
      blockId: lot?.blockId || preselectedBlockId || ''
    }
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: lot?.name || '',
        area: lot?.area || 0,
        lotPrice: lot?.lotPrice || 0,
        urbanizationPrice: lot?.urbanizationPrice || 0,
        status: (lot?.status as LotStatus) || 'Activo',
        blockId: lot?.blockId || preselectedBlockId || ''
      });
    }
  }, [lot, form, isOpen, preselectedBlockId]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const calculateTotal = React.useCallback(
    (lotPrice?: number, urbanizationPrice?: number) => {
      const price = lotPrice || form.getValues('lotPrice') || 0;
      const urbanization = urbanizationPrice || form.getValues('urbanizationPrice') || 0;
      return price + urbanization;
    },
    [form]
  );
  const onSubmit = async (values: LotFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && lot) {
        await onUpdateLot(lot.id, {
          name: values.name,
          area: values.area,
          lotPrice: values.lotPrice,
          urbanizationPrice: values.urbanizationPrice,
          status: values.status as LotStatus
        });
      } else {
        await onCreateLot({
          name: values.name,
          area: values.area,
          lotPrice: values.lotPrice,
          urbanizationPrice: values.urbanizationPrice,
          status: values.status as LotStatus,
          blockId: values.blockId
        });
      }
      onClose();
    } catch (error) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el lote:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getBlockAndStageName = (blockId: string) => {
    const block = blockOptions.find((b) => b.id === blockId);
    if (block) {
      return `${block.stageName} - Manzana ${block.name}`;
    }
    return 'Manzana no encontrada';
  };
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Activo':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          badge: (
            <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400">
              Activo
            </Badge>
          ),
          color: 'text-green-500'
        };
      case 'Inactivo':
        return {
          icon: <XCircle className="h-4 w-4 text-gray-500" />,
          badge: <Badge variant="secondary">Inactivo</Badge>,
          color: 'text-gray-500'
        };
      case 'Separado':
        return {
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          badge: (
            <Badge className="border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-400">
              Separado
            </Badge>
          ),
          color: 'text-blue-500'
        };
      case 'Vendido':
        return {
          icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
          badge: (
            <Badge className="border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-400">
              Vendido
            </Badge>
          ),
          color: 'text-purple-500'
        };
      default:
        return {
          icon: <Activity className="h-4 w-4 text-gray-500" />,
          badge: <Badge variant="outline">Desconocido</Badge>,
          color: 'text-gray-500'
        };
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden sm:max-w-md md:max-w-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-1.5">
              <MapPin className="text-primary h-5 w-5" />
            </div>
            <span>{isEditMode ? 'Editar Lote' : 'Nuevo Lote'}</span>
            {isEditMode && lot && getStatusInfo(lot.status).badge}
          </DialogTitle>
        </DialogHeader>
        <div className="-mx-1 max-h-[60vh] overflow-y-auto p-1 px-6">
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
              {isEditMode && lot && (
                <div className="bg-muted/20 mb-2 rounded-md p-3">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 rounded-md p-1.5">
                        <Building className="text-primary h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Ubicación:</span>{' '}
                        <span className="font-medium">{getBlockAndStageName(lot.blockId)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-secondary/20 self-end sm:self-auto">
                      ID: {lot.id.substring(0, 8)}...
                    </Badge>
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Nombre del lote</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ej. Lote 1, A1, 15B..."
                          {...field}
                          className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                        />
                        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-muted-foreground mt-1 text-xs">
                      El nombre debe ser único dentro de la manzana.
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Área (m²)</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="120.50"
                          {...field}
                          className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                        />
                        <SquareFunctionIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="lotPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <span>Precio del lote</span>
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="10000.00"
                              {...field}
                              className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                            />
                            <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urbanizationPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <span>Precio de urbanización</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="5000.00"
                              {...field}
                              className="focus:border-primary bg-white pl-9 transition-all dark:bg-gray-900"
                            />
                            <CreditCard className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="bg-primary/5 rounded-md bg-white p-4 dark:bg-gray-900">
                  <div className="text-muted-foreground mb-1 text-sm">Precio total:</div>
                  <div className="text-primary text-2xl font-semibold">
                    {formatCurrency(
                      calculateTotal(
                        parseFloat(form.watch('lotPrice').toString()),
                        parseFloat(form.watch('urbanizationPrice').toString())
                      )
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Suma del precio del lote y precio de urbanización
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Estado del lote</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl className="bg-white dark:bg-gray-900">
                        <div className="relative">
                          <SelectTrigger className="pl-9">
                            <Activity className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="Activo"
                          className="flex items-center gap-2 bg-white dark:bg-gray-900"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Activo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Inactivo" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                            <span>Inactivo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Vendido" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>Vendido</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Separado" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Separado</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="blockId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <span>Manzana</span>
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl className="bg-white dark:bg-gray-900">
                          <div className="relative">
                            <SelectTrigger className="pl-9">
                              <Layers className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <SelectValue placeholder="Seleccionar manzana" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {blockOptions.map((block) => (
                            <SelectItem
                              key={block.id}
                              value={block.id}
                              className="bg-white dark:bg-gray-900"
                            >
                              <div className="flex items-center gap-1">
                                <span>
                                  Etapa {block.stageName} - Mz. {block.name}
                                </span>
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
              {!isEditMode && (
                <div className="text-muted-foreground space-y-1 rounded-md bg-white p-3 text-xs dark:bg-gray-900">
                  <p className="text-primary mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                    <Check className="h-3.5 w-3.5" />
                    <span>Consejos para la creación de lotes</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Utiliza nombres cortos y fáciles de identificar</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>El área debe ser exacta y estar en metros cuadrados</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Los precios deben incluir todos los decimales necesarios</span>
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
              'Actualizar lote'
            ) : (
              'Crear lote'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
