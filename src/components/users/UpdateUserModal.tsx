import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserList, UpdateUserDto, Role } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, User, Mail, ShieldCheck, Activity } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormInputField from "../common/form/FormInputField";
import FormSelectField from "../common/form/FormSelectField";
interface UpdateUserModalProps {
  user: UserList;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateUserDto) => Promise<UserList>;
  roles: Role[];
  rolesLoading?: boolean;
}
const updateUserSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingrese un correo válido"),
  isActive: z.string(),
  roleId: z.string().min(1, "Debe seleccionar un rol"),
});
type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export function UpdateUserModal({
  user,
  isOpen,
  onClose,
  onUpdate,
  roles,
  rolesLoading = false,
}: UpdateUserModalProps) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive.toString(),
      roleId: user.role.id.toString(),
    },
  });
  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      setError(null);
      await onUpdate(user.id, { ...data, roleId: Number(data.roleId) });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el usuario"
      );
    }
  };
  const formFields = [
    {
      name: "firstName",
      label: "Nombre",
      placeholder: "Nombre",
      icon: <User />,
    },
    {
      name: "lastName",
      label: "Apellido",
      placeholder: "Apellido",
      icon: <User />,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "correo@ejemplo.com",
      type: "email",
      icon: <Mail />,
    },
  ] as const;
  const roleOptions = roles.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  }));
  const statusOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col w-screen max-w-[900px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Usuario
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formFields.map((field) => (
                    <FormInputField<UpdateUserFormData>
                      key={field.name}
                      {...field}
                      control={form.control}
                      errors={form.formState.errors}
                    />
                  ))}
                  <FormSelectField<UpdateUserFormData>
                    name="isActive"
                    label="Estado"
                    placeholder="Seleccionar estado"
                    icon={<Activity />}
                    options={statusOptions}
                    control={form.control}
                    errors={form.formState.errors}
                  />
                  <FormSelectField<UpdateUserFormData>
                    name="roleId"
                    label="Rol"
                    placeholder={
                      rolesLoading ? "Cargando roles..." : "Seleccionar rol"
                    }
                    icon={<ShieldCheck />}
                    options={roleOptions}
                    control={form.control}
                    errors={form.formState.errors}
                    disabled={rolesLoading}
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
            disabled={rolesLoading || form.formState.isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
