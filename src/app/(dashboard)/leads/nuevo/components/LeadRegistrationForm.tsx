'use client';

import FormInputField from '@/components/common/form/FormInputField';
import FormSelectField from '@/components/common/form/FormSelectField';
import FormMultiSelectField from '@/components/common/form/FormMultiSelectField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import {
  CreateUpdateLeadDto,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  UserCheck,
  Users
} from 'lucide-react';
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

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
    districtOptions,
    projectOptions,
    estadoCivilOptions
  } = useLeadRegister({
    lead,
    searchedDocument,
    getDepartments,
    getProvinces,
    getDistricts,
    saveLead,
    leadSources
  });

  const isNewLead = !lead;

  return (
    <div className="flex flex-col overflow-y-hidden">
      <CardContent className="space-y-8 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Error Alert */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg"
              >
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-sm text-red-700 dark:text-red-300">
                    {submitError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Personal Information Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información Personal
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Datos básicos de identificación del lead
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  icon={<CreditCard className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly || !!lead}
                />

                <FormInputField<LeadFormValues>
                  name="document"
                  label="Número de Documento"
                  placeholder="Ingrese número de documento"
                  icon={<FileText className="h-4 w-4" />}
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
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información de Contacto
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Medios de comunicación con el lead
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInputField<LeadFormValues>
                  name="phone"
                  label="Teléfono Principal"
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
            </motion.div>

            {/* Additional Information Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50">
                  <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información Adicional
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fuente del lead y ubicación geográfica
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                <div className="space-y-4">
                  <FormSelectField<LeadFormValues>
                    name="departmentId"
                    label="Departamento"
                    placeholder="Seleccionar departamento"
                    options={departmentOptions}
                    icon={<MapPin className="h-4 w-4" />}
                    control={form.control}
                    errors={form.formState.errors}
                    disabled={isReadOnly}
                  />

                  <FormSelectField<LeadFormValues>
                    name="provinceId"
                    label="Provincia"
                    placeholder="Seleccionar provincia"
                    options={provinceOptions}
                    icon={<MapPin className="h-4 w-4" />}
                    control={form.control}
                    errors={form.formState.errors}
                    disabled={isReadOnly || !departmentId}
                  />

                  <FormSelectField<LeadFormValues>
                    name="ubigeoId"
                    label="Distrito"
                    placeholder="Seleccionar distrito"
                    options={districtOptions}
                    icon={<MapPin className="h-4 w-4" />}
                    control={form.control}
                    errors={form.formState.errors}
                    disabled={isReadOnly || !provinceId}
                  />
                </div>
              </div>
            </motion.div>

            {/* Companion Information Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50">
                  <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información del Acompañante
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Datos de la persona que acompaña al lead (opcional)
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInputField<LeadFormValues>
                  name="companionFullName"
                  label="Nombre Completo del Acompañante"
                  placeholder="Nombre y apellido del acompañante"
                  icon={<User className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />

                <FormInputField<LeadFormValues>
                  name="companionDni"
                  label="DNI del Acompañante"
                  placeholder="Número de DNI"
                  icon={<CreditCard className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />

                <FormInputField<LeadFormValues>
                  name="companionRelationship"
                  label="Relación con el Lead"
                  placeholder="Ej: Esposa, Hermano, Amigo"
                  icon={<Heart className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />
              </div>
            </motion.div>

            {/* Interest Projects Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Proyectos de Interés
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecciona los proyectos que le interesan al lead
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <FormMultiSelectField<LeadFormValues>
                name="interestProjects"
                label="Proyectos de Interés"
                placeholder="Seleccionar proyectos"
                icon={<Home className="h-4 w-4" />}
                options={projectOptions}
                control={form.control}
                errors={form.formState.errors}
                disabled={isReadOnly}
              />
            </motion.div>

            {/* Financial Information Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información Financiera
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detalles sobre tarjetas y estado civil
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormSelectField<LeadFormValues>
                  name="estadoCivil"
                  label="Estado Civil"
                  placeholder="Seleccionar estado civil"
                  options={estadoCivilOptions}
                  icon={<Heart className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />

                <FormInputField<LeadFormValues>
                  name="cantidadHijos"
                  label="Cantidad de Hijos"
                  placeholder="0"
                  type="number"
                  icon={<Users className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={isReadOnly}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tieneTarjetasCredito"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            ¿Tiene tarjetas de crédito?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('tieneTarjetasCredito') && (
                    <FormInputField<LeadFormValues>
                      name="cantidadTarjetasCredito"
                      label="Cantidad de Tarjetas de Crédito"
                      placeholder="0"
                      type="number"
                      icon={<CreditCard className="h-4 w-4" />}
                      control={form.control}
                      errors={form.formState.errors}
                      disabled={isReadOnly}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tieneTarjetasDebito"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            ¿Tiene tarjetas de débito?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('tieneTarjetasDebito') && (
                    <FormInputField<LeadFormValues>
                      name="cantidadTarjetasDebito"
                      label="Cantidad de Tarjetas de Débito"
                      placeholder="0"
                      type="number"
                      icon={<CreditCard className="h-4 w-4" />}
                      control={form.control}
                      errors={form.formState.errors}
                      disabled={isReadOnly}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Observations Section */}
            <motion.div
              className="space-y-6"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Observaciones
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Información adicional relevante sobre el lead
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Observaciones y notas
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe observaciones adicionales sobre el lead..."
                        className="min-h-[120px] resize-none border-gray-200 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                        {...field}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Máximo 500 caracteres
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>
          </form>
        </Form>
      </CardContent>

      {/* Footer - Fixed */}
      {!isReadOnly && (
        <CardFooter className="flex-shrink-0 gap-4 border-t border-gray-200 bg-white px-8 pt-6 pb-8 dark:border-gray-700 dark:bg-gray-900">
          {onCancelRegistration && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelRegistration}
              disabled={isSubmitting}
              className="flex h-11 items-center gap-2 border-gray-300 px-6 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a búsqueda
            </Button>
          )}

          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="flex h-11 flex-1 items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                {isNewLead ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Registrar Lead
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Actualizar Lead
                  </>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
