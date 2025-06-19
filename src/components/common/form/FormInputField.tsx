import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
interface FormInputFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  disabled?: boolean;
}
const FormInputField = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  icon,
  control,
  errors,
  disabled
}: FormInputFieldProps<TFormValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(errors[name] && 'text-destructive')}>{label}</FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                className={cn(
                  'bg-white pl-8 dark:bg-gray-900',
                  errors[name] && 'border-destructive focus-visible:ring-destructive'
                )}
                disabled={disabled}
              />
              <span
                className={cn(
                  'absolute left-2.5 flex h-3.5 w-3.5 items-center',
                  errors[name] ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {icon}
              </span>
            </div>
          </FormControl>
          <FormMessage className="text-destructive text-xs" />
        </FormItem>
      )}
    />
  );
};
export default FormInputField;
