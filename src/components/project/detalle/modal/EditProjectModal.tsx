import { ProjectDetailDto, UpdateProjectDto } from "@/types/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Building2,
  Upload,
  X,
  Check,
  CalendarDays,
  Clock,
  ImagePlus,
} from "lucide-react";
import Image from "next/image";
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
    logoFile?: File | null,
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
    project?.logo || null,
  );
  const [removeCurrentLogo, setRemoveCurrentLogo] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      isActive: project?.isActive ?? true,
    },
  });
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        isActive: project.isActive,
      });
      setLogoPreview(project.logo);
      setRemoveCurrentLogo(false);
    }
  }, [project, form]);
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);
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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  if (!project) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span>Editar Proyecto</span>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-1 -mx-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Creado: {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Última actualización: {formatDate(project.updatedAt)}
                  </span>
                </div>
              </div>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <span>Nombre del proyecto</span>
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ingresa el nombre del proyecto"
                          {...field}
                          className="pl-9 transition-all focus:border-primary"
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
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
                          Estado del proyecto
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value
                            ? "El proyecto está visible y operativo"
                            : "El proyecto está oculto e inoperativo"}
                        </div>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${field.value ? "text-muted-foreground" : "font-medium"}`}
                          >
                            Inactivo
                          </span>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                          <span
                            className={`text-sm ${field.value ? "font-medium" : "text-muted-foreground"}`}
                          >
                            Activo
                          </span>
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <Separator className="my-2" />
              {}
              <div className="space-y-3">
                <FormLabel className="flex items-center gap-1.5">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <span>Logo del proyecto</span>
                </FormLabel>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {}
                  <div className="w-32 h-32 border rounded-md flex items-center justify-center overflow-hidden bg-secondary/20 relative group">
                    {logoPreview ? (
                      <div className="relative h-full w-full flex items-center justify-center">
                        <Image
                          width={116}
                          height={116}
                          src={logoPreview}
                          alt="Logo vista previa"
                          className="object-contain max-h-28 max-w-28 p-2"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        >
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleRemoveLogo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    ) : removeCurrentLogo ? (
                      <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                        <div className="bg-muted-foreground/10 p-3 rounded-full mb-2">
                          <Building2 className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <span className="text-xs">Sin logo</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={handleCancelRemoveLogo}
                        >
                          Restaurar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Building2 className="h-10 w-10 mb-1 text-muted-foreground/70" />
                        <span className="text-xs">Sin logo</span>
                      </div>
                    )}
                  </div>
                  {}
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="logo-input"
                        className="cursor-pointer text-sm bg-primary/5 hover:bg-primary/10 border-dashed border-2 border-primary/20 hover:border-primary/30 rounded-md flex flex-col items-center gap-2 p-4 transition-colors"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-primary">
                            Haz clic para seleccionar
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            O arrastra y suelta una imagen aquí
                          </p>
                        </div>
                        <input
                          id="logo-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Formato: JPG, PNG, GIF, SVG o WEBP</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Tamaño máximo: 2MB</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Dimensiones recomendadas: Cuadrada</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <FormMessage />
            </form>
          </Form>
        </div>
        <DialogFooter className="border-t pt-3 mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="h-9"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isUpdating ? (
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
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
