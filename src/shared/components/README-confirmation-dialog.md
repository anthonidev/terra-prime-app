# ConfirmationDialog

Modal de confirmación reutilizable basado en AlertDialog de shadcn/ui.

## Uso con Hook (Recomendado)

El hook `useConfirmation` proporciona una manera simple de usar el modal de confirmación con async/await.

### Ejemplo Básico

```tsx
'use client';

import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar elemento',
      description: '¿Está seguro de que desea eliminar este elemento? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (confirmed) {
      // Realizar la acción
      console.log('Elemento eliminado');
    }
  };

  return (
    <>
      <Button onClick={handleDelete} variant="destructive">
        Eliminar
      </Button>

      {/* Agregar el componente al final */}
      <ConfirmationDialog />
    </>
  );
}
```

### Ejemplo con Mutación

```tsx
'use client';

import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export function MyComponent({ itemId }: { itemId: string }) {
  const { confirm, ConfirmationDialog } = useConfirmation();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      toast.success('Elemento eliminado correctamente');
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Confirmar eliminación',
      description: '¿Está seguro de eliminar este elemento?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (confirmed) {
      deleteMutation.mutate(itemId);
    }
  };

  return (
    <>
      <Button
        onClick={handleDelete}
        variant="destructive"
        disabled={deleteMutation.isPending}
      >
        Eliminar
      </Button>

      <ConfirmationDialog />
    </>
  );
}
```

## Uso Directo del Componente

También puedes usar el componente directamente si prefieres manejar el estado manualmente.

```tsx
'use client';

import { useState } from 'react';
import { ConfirmationDialog } from '@/shared/components/confirmation-dialog';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmado');
    // Realizar la acción
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Confirmación
      </Button>

      <ConfirmationDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleConfirm}
        title="Confirmar acción"
        description="¿Está seguro de realizar esta acción?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        variant="default"
      />
    </>
  );
}
```

## Opciones

### ConfirmationDialogProps

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | `boolean` | - | Estado del modal (abierto/cerrado) |
| `onOpenChange` | `(open: boolean) => void` | - | Callback cuando cambia el estado |
| `onConfirm` | `() => void` | - | Callback cuando se confirma |
| `title` | `string` | - | Título del modal |
| `description` | `string` | - | Descripción/mensaje del modal |
| `confirmText` | `string` | `'Confirmar'` | Texto del botón de confirmación |
| `cancelText` | `string` | `'Cancelar'` | Texto del botón de cancelar |
| `variant` | `'default' \| 'destructive'` | `'default'` | Variante del botón de confirmación |

## Variantes

### Default
Para acciones normales sin riesgo.

```tsx
const confirmed = await confirm({
  title: 'Guardar cambios',
  description: '¿Desea guardar los cambios realizados?',
  confirmText: 'Guardar',
  variant: 'default', // Verde (primary)
});
```

### Destructive
Para acciones destructivas o irreversibles.

```tsx
const confirmed = await confirm({
  title: 'Eliminar cuenta',
  description: 'Esta acción no se puede deshacer. ¿Está seguro?',
  confirmText: 'Eliminar',
  variant: 'destructive', // Rojo
});
```

## Casos de Uso

### 1. Eliminar elementos
```tsx
variant: 'destructive'
title: 'Eliminar [recurso]'
description: '¿Está seguro de eliminar este elemento? Esta acción no se puede deshacer.'
```

### 2. Guardar cambios
```tsx
variant: 'default'
title: 'Guardar cambios'
description: '¿Desea guardar los cambios realizados?'
```

### 3. Confirmar acción importante
```tsx
variant: 'default'
title: 'Confirmar [acción]'
description: '¿Está seguro de realizar esta acción?'
```

### 4. Regenerar/Sobrescribir
```tsx
variant: 'destructive'
title: 'Regenerar reporte'
description: '¿Está seguro de regenerar el reporte? Esto reemplazará el reporte existente.'
```

## Buenas Prácticas

1. **Usa variante `destructive`** para acciones irreversibles (eliminar, sobrescribir, etc.)
2. **Usa variante `default`** para acciones normales (guardar, actualizar, etc.)
3. **Sé claro en la descripción** sobre las consecuencias de la acción
4. **Usa async/await** con el hook para código más limpio
5. **Agrega el componente `<ConfirmationDialog />`** al final del render
6. **No olvides deshabilitar botones** mientras se ejecuta la mutación

## Ejemplo Completo (Real)

Ver implementación en: `src/features/leads/components/visits-table.tsx`
