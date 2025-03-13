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
import { AlertCircle, FileText, ActivityIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormInputField from "@/components/common/form/FormInputField";

interface CreateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; isActive?: boolean }) => Promise<any>;
}

const createLeadSourceSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  isActive: z.boolean().default(true),
});

type CreateLeadSourceFormData = z.infer<typeof createLeadSourceSchema>;

export default function CreateLeadSourceModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLeadSourceModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateLeadSourceFormData>({
    resolver: zodResolver(createLeadSourceSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateLeadSourceFormData) => {
    try {
      setError(null);
      await onCreate(data);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la fuente de lead"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nueva Fuente de Lead
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
                <FormInputField<CreateLeadSourceFormData>
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
            {form.formState.isSubmitting ? "Creando..." : "Crear Fuente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
