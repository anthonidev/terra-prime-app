'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormSelectField from '@/components/common/form/FormSelectField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentType, FindLeadByDocumentDto } from '@/types/leads.types';
import { AlertCircle, Search, User } from 'lucide-react';
const searchSchema = z.object({
  documentType: z.nativeEnum(DocumentType, {
    required_error: 'El tipo de documento es requerido'
  }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres')
});
interface LeadSearchFormProps {
  onSearch: (data: FindLeadByDocumentDto) => Promise<void>;
  isSearching: boolean;
  searchError: string | null;
  isLeadFound: boolean;
}
export default function LeadSearchForm({
  onSearch,
  isSearching,
  searchError
}: LeadSearchFormProps) {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      documentType: DocumentType.DNI,
      document: ''
    }
  });
  const handleSubmit = async (data: z.infer<typeof searchSchema>) => {
    await onSearch(data);
  };
  const documentTypeOptions = [
    { value: DocumentType.DNI, label: 'DNI' },
    { value: DocumentType.CE, label: 'CE' },
    { value: DocumentType.RUC, label: 'RUC' }
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Buscar Lead</CardTitle>
        <CardDescription>Ingresa el documento para verificar si el lead ya existe</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {searchError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="text-destructive h-4 w-4" />
                <AlertDescription className="text-destructive text-sm">
                  {searchError ||
                    'No se encontró ningún lead con ese documento. Puedes crear uno nuevo.'}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelectField<z.infer<typeof searchSchema>>
                name="documentType"
                label="Tipo de Documento"
                placeholder="Seleccionar tipo"
                options={documentTypeOptions}
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Ingrese número de documento"
                          {...field}
                          className="pl-9"
                        />
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary-hover"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
