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
import {
  LotResponseDto,
  LotStatus,
  StageDetailDto,
} from "@/types/project.types";
import { AlertCircle, MapPin } from "lucide-react";
const lotSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre debe tener al menos 1 caracter")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message:
        "El nombre solo debe contener letras, números, espacios y guiones",
    }),
  area: z.coerce.number().min(0.01, "El área debe ser mayor a 0"),
  lotPrice: z.coerce
    .number()
    .min(0.01, "El precio del lote debe ser mayor a 0"),
  urbanizationPrice: z.coerce
    .number()
    .min(0, "El precio de habilitación urbana debe ser mayor o igual a 0")
    .default(0),
  status: z
    .enum(["Activo", "Inactivo", "Vendido", "Separado"], {
      invalid_type_error: "El estado debe ser válido",
    })
    .default("Activo"),
  blockId: z.string({
    required_error: "Debe seleccionar una manzana",
  }),
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
  error,
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
          stageName: stage.name,
        });
      });
    });
    return options.sort(
      (a, b) =>
        a.stageName.localeCompare(b.stageName) || a.name.localeCompare(b.name)
    );
  }, [stages]);
  const form = useForm<LotFormValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      name: lot?.name || "",
      area: lot?.area || 0,
      lotPrice: lot?.lotPrice || 0,
      urbanizationPrice: lot?.urbanizationPrice || 0,
      status: (lot?.status as LotStatus) || "Activo",
      blockId: lot?.blockId || preselectedBlockId || "",
    },
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: lot?.name || "",
        area: lot?.area || 0,
        lotPrice: lot?.lotPrice || 0,
        urbanizationPrice: lot?.urbanizationPrice || 0,
        status: (lot?.status as LotStatus) || "Activo",
        blockId: lot?.blockId || preselectedBlockId || "",
      });
    }
  }, [lot, form, isOpen, preselectedBlockId]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount);
  };
  const calculateTotal = React.useCallback(
    (lotPrice?: number, urbanizationPrice?: number) => {
      const price = lotPrice || form.getValues("lotPrice") || 0;
      const urbanization =
        urbanizationPrice || form.getValues("urbanizationPrice") || 0;
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
          status: values.status as LotStatus,
        });
      } else {
        await onCreateLot({
          name: values.name,
          area: values.area,
          lotPrice: values.lotPrice,
          urbanizationPrice: values.urbanizationPrice,
          status: values.status as LotStatus,
          blockId: values.blockId,
        });
      }
      onClose();
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el lote:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const getBlockAndStageName = (blockId: string) => {
    const block = blockOptions.find((b) => b.id === blockId);
    if (block) {
      return `${block.stageName} - Manzana ${block.name}`;
    }
    return "Manzana no encontrada";
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <MapPin className="h-5 w-5" />
                Editar Lote
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5" />
                Nuevo Lote
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
                  <FormLabel>Nombre del lote</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Lote 1, A1, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="120.50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lotPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio del lote</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="10000.00"
                        {...field}
                      />
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
                    <FormLabel>Precio de urbanización</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="5000.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-secondary/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Precio total:</div>
              <div className="text-lg font-semibold">
                {formatCurrency(
                  calculateTotal(
                    form.watch("lotPrice"),
                    form.watch("urbanizationPrice")
                  )
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del lote</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                      <SelectItem value="Separado">Separado</SelectItem>
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
                    <FormLabel>Manzana</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar manzana" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blockOptions.map((block) => (
                          <SelectItem key={block.id} value={block.id}>
                            {block.stageName} - Mz. {block.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isEditMode && lot && (
              <div className="bg-primary/10 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Ubicación:</div>
                <div className="font-medium">
                  {getBlockAndStageName(lot.blockId)}
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
