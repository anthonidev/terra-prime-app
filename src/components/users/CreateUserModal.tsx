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
import { CreateUserFormData, createUserSchema } from "@/lib/validations/user";
import { CreateUserDto, Role, UserList } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  FileText,
  KeyRound,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInputField from "../common/form/FormInputField";
import FormSelectField from "../common/form/FormSelectField";
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateUserDto) => Promise<UserList>;
  roles: Role[];
  rolesLoading?: boolean;
}
export function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
  roles,
  rolesLoading = false,
}: CreateUserModalProps) {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      document: "",
      firstName: "",
      lastName: "",
      isActive: true,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setError(null);
      await onCreate(data);
      form.reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuario");
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
      name: "document",
      label: "Documento",
      placeholder: "Documento",
      icon: <FileText />,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "correo@ejemplo.com",
      type: "email",
      icon: <Mail />,
    },
    {
      name: "password",
      label: "Contraseña",
      placeholder: "••••••",
      type: "password",
      icon: <KeyRound />,
    },
  ] as const;
  const roleOptions = roles.map((role) => ({
    value: role.id.toString(),
    label: role.name,
  }));
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] flex flex-col max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Crear Nuevo Usuario
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
                    <FormInputField<CreateUserFormData>
                      key={field.name}
                      {...field}
                      control={form.control}
                      errors={form.formState.errors}
                    />
                  ))}
                  <FormSelectField<CreateUserFormData>
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
            {form.formState.isSubmitting ? "Creando..." : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
