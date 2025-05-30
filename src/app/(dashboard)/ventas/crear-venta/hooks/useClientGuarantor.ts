import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { LeadsVendorItems } from '@/types/sales';
import { GuarantorFormData } from '../validations/saleValidation';
import { createClientAndGuarantor, getClients, getLeadsVendor } from '../action';

interface UseClientGuarantorReturn {
  // Data
  leads: LeadsVendorItems[];
  selectedLead: LeadsVendorItems | null;
  existingClient: { id: number; address: string } | null;
  guarantorData: { id: number; name: string } | null;
  clientAddress: string;

  // Loading states
  loading: {
    leads: boolean;
    client: boolean;
    creating: boolean;
  };

  // Actions
  loadLeads: () => Promise<void>;
  handleLeadChange: (leadId: string) => Promise<void>;
  handleAddressChange: (address: string) => void;
  handleGuarantorSuccess: (guarantorFormData: GuarantorFormData) => Promise<void>;

  // Getters
  getClientId: () => number;
  getGuarantorId: () => number;
}

export function useClientGuarantor(): UseClientGuarantorReturn {
  const [leads, setLeads] = useState<LeadsVendorItems[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadsVendorItems | null>(null);
  const [clientAddress, setClientAddress] = useState<string>('');
  const [existingClient, setExistingClient] = useState<{ id: number; address: string } | null>(
    null
  );
  const [guarantorData, setGuarantorData] = useState<{ id: number; name: string } | null>(null);

  const [loading, setLoading] = useState({
    leads: false,
    client: false,
    creating: false
  });

  const loadLeads = useCallback(async () => {
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
  }, []);

  const checkExistingClient = useCallback(async (document: string) => {
    setLoading((prev) => ({ ...prev, client: true }));
    try {
      const client = await getClients(parseInt(document));
      setExistingClient(client);
      setClientAddress(client.address);
      toast.success('Cliente existente encontrado');
    } catch (error) {
      // No existe el cliente, se puede continuar manualmente
      setExistingClient(null);
      console.log('Client not found, will be created');
    } finally {
      setLoading((prev) => ({ ...prev, client: false }));
    }
  }, []);

  const handleLeadChange = useCallback(
    async (leadId: string) => {
      const lead = leads.find((l) => l.id === leadId);
      setSelectedLead(lead || null);

      // Reset client and guarantor data
      setExistingClient(null);
      setGuarantorData(null);
      setClientAddress('');

      if (lead) {
        await checkExistingClient(lead.document);
      }
    },
    [leads, checkExistingClient]
  );

  const handleAddressChange = useCallback((address: string) => {
    setClientAddress(address);
  }, []);

  const handleGuarantorSuccess = useCallback(
    async (guarantorFormData: GuarantorFormData) => {
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

        setExistingClient({ id: result.clientId, address: clientAddress });
        setGuarantorData({
          id: result.guarantorId,
          name: `${guarantorFormData.firstName} ${guarantorFormData.lastName}`
        });

        toast.success('Cliente y garante creados/actualizados correctamente');
      } catch (error) {
        console.error('Error creating client and guarantor:', error);
        toast.error('Error al crear cliente y garante');
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, creating: false }));
      }
    },
    [selectedLead, clientAddress]
  );

  const getClientId = useCallback(() => {
    return existingClient?.id || 0;
  }, [existingClient]);

  const getGuarantorId = useCallback(() => {
    return guarantorData?.id || 0;
  }, [guarantorData]);

  return {
    // Data
    leads,
    selectedLead,
    existingClient,
    guarantorData,
    clientAddress,

    // Loading states
    loading,

    // Actions
    loadLeads,
    handleLeadChange,
    handleAddressChange,
    handleGuarantorSuccess,

    // Getters
    getClientId,
    getGuarantorId
  };
}
