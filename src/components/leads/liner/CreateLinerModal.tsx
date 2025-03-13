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
import { AlertCircle, User, FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormInputField from "@/components/common/form/FormInputField";
import FormSelectField from "@/components/common/form/FormSelectField";
import { DocumentType } from "@/types/leads.types";

interface CreateLinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    firstName: string;
    lastName: string;
    document: string;
    documentType: DocumentType;
    isActive?: boolean;
  }) => Promise<any>;
}

const createLinerSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "El nombre solo debe contener letras y espacios",
    }),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede tener más de 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: "El apellido solo debe contener letras y espacios",
    }),
  document: z
    .string()
    .min(1, "El documento es requerido")
    .max(20, "El documento no puede tener más de 20 caracteres"),
  documentType: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: "El tipo de documento es requerido" }),
  }),
  isActive: z.boolean().default(true),
});

type CreateLinerFormData = z.infer<typeof createLinerSchema>;

export default function CreateLinerModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLinerModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateLinerFormData>({
    resolver: zodResolver(createLinerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      document: "",
      documentType: DocumentType.DNI,
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateLinerFormData) => {
    try {
      setError(null);
      await onCreate(data);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el liner");
    }
  };

  const documentTypeOptions = [
    { value: DocumentType.DNI, label: "DNI" },
    { value: DocumentType.CE, label: "CE" },
    { value: DocumentType.RUC, label: "RUC" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Nuevo Liner
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

        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInputField<CreateLinerFormData>
                  name="firstName"
                  label="Nombre"
                  placeholder="Nombre del liner"
                  icon={<User className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormInputField<CreateLinerFormData>
                  name="lastName"
                  label="Apellido"
                  placeholder="Apellido del liner"
                  icon={<User className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormInputField<CreateLinerFormData>
                  name="document"
                  label="Documento"
                  placeholder="Número de documento"
                  icon={<FileText className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />

                <FormSelectField<CreateLinerFormData>
                  name="documentType"
                  label="Tipo de Documento"
                  placeholder="Seleccionar tipo"
                  options={documentTypeOptions}
                  icon={<CreditCard className="h-4 w-4" />}
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
            {form.formState.isSubmitting ? "Creando..." : "Crear Liner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
