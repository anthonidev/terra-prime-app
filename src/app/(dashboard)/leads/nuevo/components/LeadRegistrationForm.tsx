'use client';
import FormInputField from '@/components/common/form/FormInputField';
import FormSelectField from '@/components/common/form/FormSelectField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateUpdateLeadDto,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { AlertCircle, Building, Calendar, Mail, Phone, Save, User } from 'lucide-react';
import { useLeadRegister } from './hooks/useLeadRegister';
import { LeadFormValues } from './schema/leadform';

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
  const {
    form,
    handleSubmit,
    documentTypeOptions,
    leadSourceOptions,
    departmentOptions,
    provinceOptions,
    departmentId,
    provinceId,
    districtOptions
  } = useLeadRegister({
    lead,
    searchedDocument,
    getDepartments,
    getProvinces,
    getDistricts,
    saveLead,
    leadSources
  });
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
