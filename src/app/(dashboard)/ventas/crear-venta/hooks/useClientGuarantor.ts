import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LeadsVendor } from '@domain/entities/sales/leadsvendors.entity';
import { GuarantorFormData, SecondaryClientFormData } from '../validations/saleValidation';
import {
  getLeadsVendor,
  getClientsByDocument,
  createClientGuarantor
} from '@infrastructure/server-actions/sales.actions';
import { Client } from '@domain/entities/sales/client.entity';

interface UseClientGuarantorReturn {
  leads: LeadsVendor[];
  selectedLead: LeadsVendor | null;
  existingClient: { id: number; address: string } | null;
  guarantorData: { id: number; name: string } | null;
  secondaryClientsData: { id: number; name: string }[];
  clientAddress: string;

  loading: {
    leads: boolean;
    client: boolean;
    creating: boolean;
  };

  loadLeads: () => Promise<void>;
  handleLeadChange: (leadId: string) => Promise<void>;
  handleAddressChange: (address: string) => void;
  handleGuarantorClientSuccess: (
    secondaryClientFormData: SecondaryClientFormData[],
    guarantorFormData?: GuarantorFormData
  ) => Promise<void>;

  getClientId: () => number;
  getGuarantorId: () => number;
  getSecondaryClientsId: () => number[];
}

export function useClientGuarantor(): UseClientGuarantorReturn {
  const [leads, setLeads] = useState<LeadsVendor[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadsVendor | null>(null);
  const [clientAddress, setClientAddress] = useState<string>('');
  const [existingClient, setExistingClient] = useState<Client | null>(null);
  const [guarantorData, setGuarantorData] = useState<{ id: number; name: string } | null>(null);
  const [secondaryClientsData, setSecondaryClientsData] = useState<{ id: number; name: string }[]>(
    []
  );

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
      const client = await getClientsByDocument(parseInt(document));
      setExistingClient(client);
      setClientAddress(client.address);
      toast.success('Cliente existente encontrado');
    } catch {
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

      setExistingClient(null);
      setGuarantorData(null);
      setSecondaryClientsData([]);
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

  const handleGuarantorClientSuccess = useCallback(
    async (
      secondaryClientsFormData: SecondaryClientFormData[],
      guarantorFormData?: GuarantorFormData
    ) => {
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
          createSecondaryClient: secondaryClientsFormData,
          document: selectedLead.document
        };

        const result = await createClientGuarantor(payload);

        setExistingClient({ id: result.clientId, address: clientAddress });
        if (guarantorFormData) {
          setGuarantorData({
            id: result.guarantorId,
            name: `${guarantorFormData.firstName} ${guarantorFormData.lastName}`
          });
        }
        setSecondaryClientsData(
          result.secondaryClientIds.map((id, index) => ({
            id,
            name: `${secondaryClientsFormData[index].firstName} ${secondaryClientsFormData[index].lastName}`
          }))
        );

        toast.success('Cliente y garante creados/actualizados correctamente');
      } catch (error) {
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

  const getSecondaryClientsId = useCallback(() => {
    return secondaryClientsData.map((client) => client.id);
  }, [secondaryClientsData]);

  return {
    leads,
    selectedLead,
    existingClient,
    guarantorData,
    secondaryClientsData,
    clientAddress,

    loading,

    loadLeads,
    handleLeadChange,
    handleAddressChange,
    handleGuarantorClientSuccess,

    getClientId,
    getGuarantorId,
    getSecondaryClientsId
  };
}
