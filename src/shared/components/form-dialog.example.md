# FormDialog Component

Componente reutilizable para crear modales de formulario con una estructura consistente para operaciones de creación y edición.

## Características

- ✅ Iconos automáticos: `Plus` para crear, `Edit` para editar
- ✅ Estructura consistente con header, body y footer
- ✅ Botones de acción predefinidos (Cancelar/Guardar)
- ✅ Estado de carga integrado
- ✅ Diseño compacto y profesional
- ✅ Múltiples tamaños disponibles (sm, md, lg, xl)
- ✅ Manejo automático de formularios

## Props

| Prop           | Tipo                           | Default                     | Descripción                                      |
| -------------- | ------------------------------ | --------------------------- | ------------------------------------------------ |
| `open`         | `boolean`                      | -                           | Controla si el diálogo está abierto              |
| `onOpenChange` | `(open: boolean) => void`      | -                           | Callback cuando cambia el estado del diálogo     |
| `title`        | `string`                       | -                           | Título del modal                                 |
| `description`  | `string`                       | -                           | Descripción/subtítulo del modal                  |
| `isEditing`    | `boolean`                      | `false`                     | Define si es modo edición (cambia icono y texto) |
| `isPending`    | `boolean`                      | `false`                     | Estado de carga del formulario                   |
| `onSubmit`     | `(e?: FormEvent) => void`      | -                           | Función que se ejecuta al enviar el formulario   |
| `onCancel`     | `() => void`                   | `onOpenChange(false)`       | Función que se ejecuta al cancelar               |
| `children`     | `ReactNode`                    | -                           | Contenido del formulario                         |
| `submitLabel`  | `string`                       | "Guardar cambios" / "Crear" | Texto del botón submit                           |
| `cancelLabel`  | `string`                       | "Cancelar"                  | Texto del botón cancelar                         |
| `maxWidth`     | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`                      | Ancho máximo del modal                           |

## Ejemplo Básico

```tsx
import { FormDialog } from '@/shared/components/form-dialog';
import { useForm } from 'react-hook-form';

export function MyFormDialog({ open, onOpenChange, item }) {
  const isEditing = !!item;
  const form = useForm();
  const { mutate, isPending } = useCreateOrUpdate();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar elemento' : 'Crear elemento'}
      description={isEditing ? 'Actualiza la información' : 'Completa el formulario'}
      isEditing={isEditing}
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth="md"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </FormDialog>
  );
}
```

## Ejemplo con React Hook Form

```tsx
import { FormDialog } from '@/shared/components/form-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export function UserFormDialog({ open, onOpenChange, user }) {
  const isEditing = !!user;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: user || { email: '', name: '' },
  });

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  const onSubmit = (data) => {
    if (isEditing) {
      updateUser(
        { id: user.id, data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar usuario' : 'Crear usuario'}
      description="Completa la información del usuario"
      isEditing={isEditing}
      isPending={isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </FormDialog>
  );
}
```

## Tamaños Disponibles

```tsx
// Pequeño (400px)
<FormDialog maxWidth="sm" {...props} />

// Mediano (500px) - Default
<FormDialog maxWidth="md" {...props} />

// Grande (600px)
<FormDialog maxWidth="lg" {...props} />

// Extra Grande (700px)
<FormDialog maxWidth="xl" {...props} />
```

## Personalización de Labels

```tsx
<FormDialog submitLabel="Registrar" cancelLabel="Descartar" {...props}>
  {/* contenido */}
</FormDialog>
```

## Notas Importantes

1. **El componente ya incluye el tag `<form>`**: No es necesario envolver los children en un `<form>` adicional.

2. **Manejo de submit**: El componente automáticamente previene el comportamiento por defecto del formulario y llama a `onSubmit`.

3. **Estado de carga**: Cuando `isPending` es `true`, se muestra un spinner en el botón submit y se deshabilitan ambos botones.

4. **Iconos automáticos**:
   - `isEditing=false` → Muestra icono `Plus` (crear)
   - `isEditing=true` → Muestra icono `Edit` (editar)

5. **Estructura visual**: El componente incluye separadores automáticos entre header, body y footer para una presentación consistente.

## Estilos Integrados

El componente sigue el design system de `globals.css`:

- Colores primarios para iconos y botones
- Espaciado compacto (`space-y-3.5` para campos)
- Inputs de altura `h-9`
- Sombras y efectos de hover consistentes
- Backdrop blur para efecto glassmorphism
