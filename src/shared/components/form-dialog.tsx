'use client';

import { FormEvent, ReactNode } from 'react';
import { Edit, Plus, type LucideIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isEditing?: boolean;
  isPending?: boolean;
  onSubmit?: (e?: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  form?: UseFormReturn<any>;
  icon?: LucideIcon;
  className?: string;
}

const maxWidthClasses = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[500px]',
  lg: 'sm:max-w-[600px]',
  xl: 'sm:max-w-[700px]',
  '2xl': 'sm:max-w-[850px]',
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  isEditing = false,
  isPending = false,
  onSubmit,
  onCancel,
  children,
  submitLabel,
  cancelLabel = 'Cancelar',
  maxWidth = 'md',
  form,
  icon: Icon,
  className,
}: FormDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const defaultSubmitLabel = isEditing ? 'Guardar cambios' : 'Crear';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="-mx-1 flex-1 overflow-y-auto px-1">
        <div className="space-y-4 py-2">{children}</div>
      </div>

      <div className="mt-4 flex shrink-0 flex-col gap-4">
        <Separator />
        <div className="flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="hover:bg-muted/50 h-9 min-w-[90px] transition-all"
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 min-w-[110px] shadow-sm transition-all hover:shadow-md"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="border-primary-foreground h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                Guardando...
              </span>
            ) : (
              submitLabel || defaultSubmitLabel
            )}
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'bg-card flex max-h-[85vh] flex-col gap-0 border shadow-xl',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <DialogHeader className="shrink-0 space-y-1 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 border-primary/20 flex h-9 w-9 items-center justify-center rounded-lg border">
              {Icon ? (
                <Icon className="text-primary h-4 w-4" />
              ) : isEditing ? (
                <Edit className="text-primary h-4 w-4" />
              ) : (
                <Plus className="text-primary h-4 w-4" />
              )}
            </div>
            <div>
              <DialogTitle className="text-foreground text-lg font-semibold tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="mb-4 shrink-0" />

        {form ? <Form {...form}>{content}</Form> : content}
      </DialogContent>
    </Dialog>
  );
}
