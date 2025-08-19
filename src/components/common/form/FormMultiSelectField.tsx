import { FormField } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormMultiSelectFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  options: Option[];
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  disabled?: boolean;
}

const FormMultiSelectField = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  icon,
  options,
  control,
  errors,
  disabled = false
}: FormMultiSelectFieldProps<TFormValues>) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];

        const toggleOption = (optionValue: string) => {
          const newValue = selectedValues.includes(optionValue)
            ? selectedValues.filter((value: string) => value !== optionValue)
            : [...selectedValues, optionValue];
          field.onChange(newValue);
        };

        const removeOption = (optionValue: string) => {
          const newValue = selectedValues.filter((value: string) => value !== optionValue);
          field.onChange(newValue);
        };

        const getSelectedLabels = () => {
          return selectedValues
            .map((value: string) => options.find((option) => option.value === value)?.label)
            .filter(Boolean);
        };

        return (
          <div className="space-y-2">
            <label className={cn('text-sm font-medium', errors[name] && 'text-destructive')}>
              {label}
            </label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    'border-input relative h-10 w-full justify-between bg-white pl-9 dark:bg-gray-900',
                    errors[name] && 'border-destructive focus-visible:ring-destructive'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2',
                      errors[name] ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 overflow-hidden text-left">
                    {selectedValues.length === 0 ? (
                      <span className="text-muted-foreground">{placeholder}</span>
                    ) : (
                      <span className="text-sm">
                        {selectedValues.length} proyecto{selectedValues.length !== 1 ? 's' : ''}{' '}
                        seleccionado{selectedValues.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] p-0" align="start">
                <div className="max-h-60 overflow-auto p-2">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => toggleOption(option.value)}
                    >
                      <Checkbox
                        checked={selectedValues.includes(option.value)}
                        onChange={() => toggleOption(option.value)}
                      />
                      <label className="flex-1 cursor-pointer text-sm font-medium">
                        {option.label}
                      </label>
                    </div>
                  ))}

                  {options.length === 0 && (
                    <div className="text-muted-foreground p-4 text-center text-sm">
                      No hay proyectos disponibles
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Selected items display */}
            {selectedValues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {getSelectedLabels().map((label, index) =>
                  label ? (
                    <Badge
                      key={`${selectedValues[index]}-${index}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {label}
                      <button
                        type="button"
                        className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            removeOption(selectedValues[index]);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => removeOption(selectedValues[index])}
                      >
                        <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null
                )}
              </div>
            )}

            {errors[name] && (
              <p className="text-destructive text-sm">{String(errors[name]?.message)}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormMultiSelectField;
