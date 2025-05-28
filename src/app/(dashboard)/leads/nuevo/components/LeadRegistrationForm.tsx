'use client';
import { useEffect, useState } from 'react';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  CreateUpdateLeadDto,
  DocumentType,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { AlertCircle, Building, Mail, User, Phone, Save, Calendar } from 'lucide-react';
import FormSelectField from '@/components/common/form/FormSelectField';
import FormInputField from '@/components/common/form/FormInputField';
import { Textarea } from '@/components/ui/textarea';
const leadFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios'
    }),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El apellido solo debe contener letras y espacios'
    }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  documentType: z.nativeEnum(DocumentType, {
    required_error: 'El tipo de documento es requerido'
  }),
  email: z.string().email('El email debe tener un formato válido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  phone2: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono alternativo debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  age: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => !val || (val >= 18 && val <= 120), {
      message: 'La edad debe estar entre 18 y 120 años'
    })
    .optional(),
  sourceId: z.string().optional().or(z.literal('')),
  departmentId: z.string().optional().or(z.literal('')),
  provinceId: z.string().optional().or(z.literal('')),
  ubigeoId: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden tener más de 500 caracteres')
    .optional()
    .or(z.literal(''))
});
type LeadFormValues = z.infer<typeof leadFormSchema>;
interface LeadRegistrationFormProps {
  lead: Lead | null;
  searchedDocument: FindLeadByDocumentDto | null;
  leadSources: LeadSource[];
  isSubmitting: boolean;
  submitError: string | null;
  saveLead: (data: CreateUpdateLeadDto) => Promise<boolean>;
  getDepartments: () => Ubigeo[];
  getProvinces: (departmentId: number) => Ubigeo[];
  getDistricts: (provinceId: number) => Ubigeo[];
  isReadOnly?: boolean;
  onCancelRegistration?: () => void;
  onFormChange?: (isDirty: boolean) => void;
}
export default function LeadRegistrationForm({
  lead,
  searchedDocument,
  leadSources,
  isSubmitting,
  submitError,
  saveLead,
  getDepartments,
  getProvinces,
  getDistricts,
  isReadOnly = false,
  onCancelRegistration
}: LeadRegistrationFormProps) {
  const [departments, setDepartments] = useState<Ubigeo[]>([]);
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [districts, setDistricts] = useState<Ubigeo[]>([]);
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: lead?.firstName || '',
      lastName: lead?.lastName || '',
      document: lead?.document || searchedDocument?.document || '',
      documentType: lead?.documentType || searchedDocument?.documentType || DocumentType.DNI,
      email: lead?.email || '',
      phone: lead?.phone || '',
      phone2: lead?.phone2 || '',
      age: lead?.age ? Number(lead.age) : undefined,
      sourceId: lead?.source?.id ? String(lead.source.id) : '',
      departmentId: lead?.departmentId ? String(lead.departmentId) : '',
      provinceId: lead?.provinceId ? String(lead.provinceId) : '',
      ubigeoId: lead?.ubigeo?.id,
      observations: ''
    }
  });
  useEffect(() => {
    if (lead) {
      form.reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        document: lead.document,
        documentType: lead.documentType,
        email: lead.email || '',
        phone: lead.phone || '',
        phone2: lead.phone2 || '',
        age: lead?.age ? Number(lead.age) : undefined,
        sourceId: lead.source?.id ? String(lead.source.id) : '',
        departmentId: lead?.departmentId ? String(lead.departmentId) : '',
        provinceId: lead?.provinceId ? String(lead.provinceId) : '',
        ubigeoId: lead.ubigeo?.id,
        observations: ''
      });
    } else if (searchedDocument) {
      form.setValue('document', searchedDocument.document);
      form.setValue('documentType', searchedDocument.documentType);
    }
  }, [lead, searchedDocument, form]);
  useEffect(() => {
    setDepartments(getDepartments());
  }, [getDepartments]);
  const departmentId = form.watch('departmentId');
  useEffect(() => {
    if (departmentId) {
      console.log('Department ID changed:', departmentId);
      setProvinces(getProvinces(Number(departmentId)));
      form.setValue('provinceId', '');
      form.setValue('ubigeoId', undefined);
    } else {
      setProvinces([]);
    }
  }, [departmentId, getProvinces, form]);
  const provinceId = form.watch('provinceId');
  useEffect(() => {
    if (provinceId) {
      setDistricts(getDistricts(Number(provinceId)));
      form.setValue('ubigeoId', undefined);
    } else {
      setDistricts([]);
    }
  }, [provinceId, getDistricts, form]);
  const handleSubmit = async (data: LeadFormValues) => {
    const leadData: CreateUpdateLeadDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      document: data.document,
      documentType: data.documentType,
      email: data.email || undefined,
      phone: data.phone || undefined,
      phone2: data.phone2 || undefined,
      age: data.age ? Number(data.age) : undefined,
      sourceId: data.sourceId || undefined,
      ubigeoId: data.ubigeoId,
      observations: data.observations || undefined,
      isNewLead: !lead
    };
    await saveLead(leadData);
  };
  const documentTypeOptions = [
    { value: DocumentType.DNI, label: 'DNI' },
    { value: DocumentType.CE, label: 'CE' },
    { value: DocumentType.RUC, label: 'RUC' }
  ];
  const leadSourceOptions = leadSources.map((source) => ({
    value: String(source.id),
    label: source.name
  }));
  const departmentOptions = departments.map((dept) => ({
    value: String(dept.id),
    label: dept.name
  }));
  const provinceOptions = provinces.map((prov) => ({
    value: String(prov.id),
    label: prov.name
  }));
  const districtOptions = districts.map((dist) => ({
    value: String(dist.id),
    label: dist.name
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {lead ? 'Actualizar información del Lead' : 'Registrar nuevo Lead'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {submitError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="text-destructive h-4 w-4" />
                <AlertDescription className="text-destructive text-sm">
                  {submitError}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-1">
              <h3 className="text-md font-medium">Información Personal</h3>
              <Separator />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInputField<LeadFormValues>
                name="firstName"
                label="Nombre"
                placeholder="Nombre del lead"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <FormInputField<LeadFormValues>
                name="lastName"
                label="Apellido"
                placeholder="Apellido del lead"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <FormSelectField<LeadFormValues>
                name="documentType"
                label="Tipo de Documento"
                placeholder="Seleccionar tipo"
                options={documentTypeOptions}
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly || !!lead}
              />
              <FormInputField<LeadFormValues>
                name="document"
                label="Número de Documento"
                placeholder="Ingrese número de documento"
                icon={<User className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly || !!lead}
              />
              <FormInputField<LeadFormValues>
                name="email"
                label="Correo Electrónico"
                placeholder="correo@ejemplo.com"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <FormInputField<LeadFormValues>
                name="age"
                label="Edad"
                placeholder="Edad"
                type="number"
                icon={<Calendar className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <FormInputField<LeadFormValues>
                name="phone"
                label="Teléfono"
                placeholder="999999999"
                icon={<Phone className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <FormInputField<LeadFormValues>
                name="phone2"
                label="Teléfono Alternativo"
                placeholder="999999999"
                icon={<Phone className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-md font-medium">Información Adicional</h3>
              <Separator />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelectField<LeadFormValues>
                name="sourceId"
                label="Fuente de Lead"
                placeholder="Seleccionar fuente"
                options={leadSourceOptions}
                icon={<Building className="h-4 w-4" />}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
              <div className="grid grid-cols-1 gap-4">
                <FormSelectField<LeadFormValues>
                  name="departmentId"
                  label="Departamento"
                  placeholder="Seleccionar departamento"
                  options={departmentOptions}
                  icon={<Building className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />
                <FormSelectField<LeadFormValues>
                  name="provinceId"
                  label="Provincia"
                  placeholder="Seleccionar provincia"
                  options={provinceOptions}
                  icon={<Building className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly || !departmentId}
                />
                <FormSelectField<LeadFormValues>
                  name="ubigeoId"
                  label="Distrito"
                  placeholder="Seleccionar distrito"
                  options={districtOptions}
                  icon={<Building className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly || !provinceId}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between gap-3 border-t pt-4">
        {!isReadOnly && (
          <>
            {onCancelRegistration && (
              <Button
                variant="outline"
                type="button"
                onClick={onCancelRegistration}
                disabled={isSubmitting}
              >
                Volver a búsqueda
              </Button>
            )}
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {lead ? 'Actualizar Lead' : 'Registrar Lead'}
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
