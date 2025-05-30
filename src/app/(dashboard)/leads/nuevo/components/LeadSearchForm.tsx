// src/app/(dashboard)/leads/nuevo/components/LeadSearchForm.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentType, FindLeadByDocumentDto } from '@/types/leads.types';
import { AlertCircle, CreditCard, FileText, Search } from 'lucide-react';

const searchSchema = z.object({
  documentType: z.nativeEnum(DocumentType, {
    required_error: 'El tipo de documento es requerido'
  }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres')
    .regex(/^[0-9]+$/, 'El documento solo debe contener números')
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
    { value: DocumentType.DNI, label: 'DNI', description: 'Documento Nacional de Identidad' },
    { value: DocumentType.CE, label: 'CE', description: 'Carné de Extranjería' },
    { value: DocumentType.RUC, label: 'RUC', description: 'Registro Único de Contribuyentes' }
  ];

  const selectedDocType = form.watch('documentType');
  const documentValue = form.watch('document');

  const getDocumentPlaceholder = (docType: DocumentType) => {
    switch (docType) {
      case DocumentType.DNI:
        return '12345678';
      case DocumentType.CE:
        return '123456789';
      case DocumentType.RUC:
        return '12345678901';
      default:
        return 'Número de documento';
    }
  };

  const getDocumentMaxLength = (docType: DocumentType) => {
    switch (docType) {
      case DocumentType.DNI:
        return 8;
      case DocumentType.CE:
        return 12;
      case DocumentType.RUC:
        return 11;
      default:
        return 20;
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Error Alert */}
          {searchError && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-sm text-red-700 dark:text-red-300">
                {searchError}
              </AlertDescription>
            </Alert>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Document Type */}
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Documento
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSearching}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-200 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="Seleccionar tipo" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Selecciona el tipo de documento que deseas buscar.
                  </div>
                </FormItem>
              )}
            />

            {/* Document Number */}
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de Documento
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder={getDocumentPlaceholder(selectedDocType)}
                        maxLength={getDocumentMaxLength(selectedDocType)}
                        {...field}
                        disabled={isSearching}
                        className="h-11 border-gray-200 pr-12 pl-11 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                      />
                      <FileText className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      {/* Document Length Indicator */}
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
                        {documentValue.length}/{getDocumentMaxLength(selectedDocType)}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                  {/* Document Type Helper */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedDocType === DocumentType.DNI && 'Ingresa 8 dígitos'}
                    {selectedDocType === DocumentType.CE && 'Ingresa hasta 12 dígitos'}
                    {selectedDocType === DocumentType.RUC && 'Ingresa 11 dígitos'}
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Search Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSearching || !form.formState.isValid}
              className="flex h-11 items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-8 text-white shadow-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Buscar Lead
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
