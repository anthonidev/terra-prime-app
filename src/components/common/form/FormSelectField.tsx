import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormSelectFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  options: Option[];
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  disabled?: boolean;
}

const FormSelectField = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  icon,
  options,
  control,
  errors,
  disabled = false,
}: FormSelectFieldProps<TFormValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-2">
          <label
            className={cn(
              "text-sm font-medium",
              errors[name] && "text-destructive"
            )}
          >
            {label}
          </label>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            value={field.value?.toString()}
          >
            <SelectTrigger
              className={cn(
                "bg-background border-input pl-9 relative",
                errors[name] &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            >
              <div
                className={cn(
                  "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                  errors[name] ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {icon}
              </div>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[name] && (
            <p className="text-sm text-destructive">
              {String(errors[name]?.message)}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default FormSelectField;
