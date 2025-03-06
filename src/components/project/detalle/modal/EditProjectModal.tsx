import { ProjectDetailDto, UpdateProjectDto } from "@/types/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Building2, Upload, X } from "lucide-react";

const projectSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, {
      message:
        "El nombre solo debe contener letras, números, espacios y guiones",
    }),
  isActive: z.boolean().default(true),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectModalProps {
  project: ProjectDetailDto | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    data: UpdateProjectDto,
    logoFile?: File | null
  ) => Promise<ProjectDetailDto | null>;
  isUpdating: boolean;
  error: string | null;
}

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  error,
}: EditProjectModalProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    project?.logo || null
  );
  const [removeCurrentLogo, setRemoveCurrentLogo] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      isActive: project?.isActive ?? true,
    },
  });

  React.useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        isActive: project.isActive,
      });
      setLogoPreview(project.logo);
      setRemoveCurrentLogo(false);
    }
  }, [project, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        form.setError("root", {
          message: "El archivo debe ser una imagen (JPEG, PNG, GIF, SVG, WEBP)",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        form.setError("root", {
          message: "La imagen no puede superar los 2MB",
        });
        return;
      }

      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setRemoveCurrentLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(null);
    setLogoPreview(null);
    setRemoveCurrentLogo(true);
    const fileInput = document.getElementById("logo-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleCancelRemoveLogo = () => {
    setRemoveCurrentLogo(false);
    setLogoPreview(project?.logo || null);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const updateData: UpdateProjectDto = {
        name: values.name,
        isActive: values.isActive,
      };

      const updated = await onUpdate(updateData, logoFile);
      if (updated) {
        if (logoPreview && logoPreview.startsWith("blob:")) {
          URL.revokeObjectURL(logoPreview);
        }
        setLogoFile(null);
        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  if (!project) return null;

  React.useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Editar Proyecto
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
                  <FormLabel>Nombre del proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proyecto" {...field} />
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
                    <FormLabel>Estado del proyecto</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "Activo" : "Inactivo"}
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

            <Separator />

            <div className="space-y-3">
              <FormLabel>Logo del proyecto</FormLabel>

              <div className="flex items-start gap-3">
                <div className="w-24 h-24 border rounded-md flex items-center justify-center overflow-hidden bg-secondary/30">
                  {logoPreview ? (
                    <div className="relative h-full w-full">
                      <img
                        src={logoPreview}
                        alt="Logo vista previa"
                        className="object-contain h-full w-full p-2"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : removeCurrentLogo ? (
                    <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                      <Building2 className="h-8 w-8 mb-1" />
                      <span>Sin logo</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 text-xs"
                        onClick={handleCancelRemoveLogo}
                      >
                        Restaurar
                      </Button>
                    </div>
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="logo-input"
                      className="cursor-pointer text-sm flex items-center justify-center gap-2 border rounded-md border-input hover:bg-accent hover:text-accent-foreground p-2 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Seleccionar imagen</span>
                      <input
                        id="logo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Formato: JPG, PNG, GIF o SVG. Máximo 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FormMessage />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
