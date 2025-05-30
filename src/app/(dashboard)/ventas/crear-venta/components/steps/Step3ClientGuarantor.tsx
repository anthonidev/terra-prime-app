'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreditCard, MapPin, User, UserCheck } from 'lucide-react';

import { LeadsVendorItems } from '@/types/sales';
import { createClientAndGuarantor, getClients, getLeadsVendor } from '../../action';
import { CreateSaleFormData, Step3FormData, step3Schema } from '../../validations/saleValidation';
import AddGuarantorModal from '../modals/AddGuarantorModal';

interface Step3Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step3', isValid: boolean) => void;
}

export default function Step3ClientGuarantor({
  formData,
  updateFormData,
  updateStepValidation
}: Step3Props) {
  const [leads, setLeads] = useState<LeadsVendorItems[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadsVendorItems | null>(null);
  const [clientAddress, setClientAddress] = useState<string>('');
  const [existingClient, setExistingClient] = useState<{ id: number; address: string } | null>(
    null
  );
  const [guarantorData, setGuarantorData] = useState<{ id: number; name: string } | null>(null);
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);

  const [loading, setLoading] = useState({
    leads: false,
    client: false,
    creating: false
  });

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      leadId: formData.leadId || '',
      clientId: formData.clientId || 0,
      guarantorId: formData.guarantorId || 0,
      clientAddress: ''
    }
  });

  // Cargar leads al montar el componente
  useEffect(() => {
    loadLeads();
  }, []);

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = !!(
        value.leadId &&
        value.clientId &&
        value.clientId > 0 &&
        value.guarantorId &&
        value.guarantorId > 0 &&
        value.clientAddress
      );

      updateStepValidation('step3', isValid);

      if (isValid) {
        updateFormData({
          leadId: value.leadId,
          clientId: value.clientId,
          guarantorId: value.guarantorId
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation]);

  const loadLeads = async () => {
    setLoading((prev) => ({ ...prev, leads: true }));
    try {
      const leadsData = await getLeadsVendor();
      setLeads(leadsData);
    } catch (error) {
      toast.error('Error al cargar los leads');
      console.error('Error loading leads:', error);
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  };

  const handleLeadChange = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    setSelectedLead(lead || null);
    form.setValue('leadId', leadId);

    // Reset client and guarantor data
    setExistingClient(null);
    setGuarantorData(null);
    setClientAddress('');
    form.setValue('clientId', 0);
    form.setValue('guarantorId', 0);
    form.setValue('clientAddress', '');

    if (lead) {
      await checkExistingClient(lead.document);
    }
  };

  const checkExistingClient = async (document: string) => {
    setLoading((prev) => ({ ...prev, client: true }));
    try {
      const client = await getClients(parseInt(document));
      setExistingClient(client);
      setClientAddress(client.address);
      form.setValue('clientAddress', client.address);
      form.setValue('clientId', client.id);
      toast.success('Cliente existente encontrado');
    } catch (error) {
      // No existe el cliente, se puede continuar manualmente
      setExistingClient(null);
      console.log('Client not found, will be created');
    } finally {
      setLoading((prev) => ({ ...prev, client: false }));
    }
  };

  const handleAddressChange = (address: string) => {
    setClientAddress(address);
    form.setValue('clientAddress', address);
  };

  const handleGuarantorSuccess = async (guarantorFormData: any) => {
    if (!selectedLead) {
      toast.error('Debe seleccionar un lead primero');
      return;
    }

    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      const payload = {
        createClient: {
          leadId: selectedLead.id,
          address: clientAddress
        },
        createGuarantor: guarantorFormData,
        document: selectedLead.document
      };

      const result = await createClientAndGuarantor(payload);

      form.setValue('clientId', result.clientId);
      form.setValue('guarantorId', result.guarantorId);

      setGuarantorData({
        id: result.guarantorId,
        name: `${guarantorFormData.firstName} ${guarantorFormData.lastName}`
      });

      setShowGuarantorModal(false);
      toast.success('Cliente y garante creados/actualizados correctamente');
    } catch (error) {
      console.error('Error creating client and guarantor:', error);
      toast.error('Error al crear cliente y garante');
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cliente y Garante
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona el lead, configura el cliente y agrega un garante
        </p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Selección de Lead */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Selección de Lead
            </h3>

            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Lead Asignado
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleLeadChange}
                      disabled={loading.leads}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loading.leads ? 'Cargando leads...' : 'Selecciona un lead'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lead.firstName} {lead.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lead.documentType}: {lead.document} • {lead.age} años
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Información del Lead Seleccionado */}
            {selectedLead && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Información del Lead</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                    <span className="font-medium">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Documento:</span>
                    <span className="font-medium">
                      {selectedLead.documentType}: {selectedLead.document}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Edad:</span>
                    <span className="font-medium">{selectedLead.age} años</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
                    <span className="font-medium">{selectedLead.phone}</span>
                  </div>
                  {selectedLead.source && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Fuente:</span>
                      <span className="font-medium">{selectedLead.source.name}</span>
                    </div>
                  )}
                  {selectedLead.ubigeo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                      <span className="font-medium">{selectedLead.ubigeo.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Configuración de Cliente */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Información del Cliente
            </h3>

            {/* Estado del Cliente */}
            {selectedLead && (
              <div className="space-y-4">
                {loading.client ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="ml-2 text-sm">Verificando cliente...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm font-medium">Estado del Cliente:</span>
                      <Badge variant={existingClient ? 'default' : 'secondary'}>
                        {existingClient ? 'Cliente Existente' : 'Cliente Nuevo'}
                      </Badge>
                    </div>

                    {existingClient && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Cliente encontrado en el sistema. Puedes editar la dirección si es
                          necesario.
                        </p>
                      </div>
                    )}

                    {/* Dirección del Cliente */}
                    <FormField
                      control={form.control}
                      name="clientAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Dirección del Cliente
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese la dirección completa"
                              value={clientAddress}
                              onChange={(e) => {
                                handleAddressChange(e.target.value);
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Sección de Garante */}
            {selectedLead && clientAddress && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Garante (Aval)
                  </h4>
                  <Button
                    type="button"
                    onClick={() => setShowGuarantorModal(true)}
                    className="flex items-center gap-2"
                    disabled={loading.creating}
                  >
                    <UserCheck className="h-4 w-4" />
                    {guarantorData ? 'Editar Garante' : 'Agregar Garante'}
                  </Button>
                </div>

                {guarantorData ? (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Garante registrado
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {guarantorData.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
                    <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Aún no se ha agregado un garante
                    </p>
                    <p className="text-xs text-gray-400">
                      Haz clic en "Agregar Garante" para continuar
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Form>

      {/* Modal para agregar garante */}
      <AddGuarantorModal
        isOpen={showGuarantorModal}
        onClose={() => setShowGuarantorModal(false)}
        onSuccess={handleGuarantorSuccess}
        isCreating={loading.creating}
      />
    </div>
  );
}
