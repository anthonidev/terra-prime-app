'use server';

import { httpClient } from '@/lib/api/http-client';
import { ClientGuarantorPayload, ClientGuarantorResponse, ClientResponse } from '@/types/sales';

export async function getClients(document: number): Promise<ClientResponse> {
  try {
    return await httpClient<ClientResponse>(`/api/sales/clients/document/${document}`);
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function createClientAndGuarantor(
  data: ClientGuarantorPayload
): Promise<ClientGuarantorResponse> {
  try {
    return await httpClient<ClientGuarantorResponse>('/api/sales/clients/guarantors/create', {
      method: 'POST',
      body: {
        createClient: {
          leadId: data.createClient.leadId,
          address: data.createClient.address
        },
        createGuarantor: {
          firstName: data.createGuarantor.firstName,
          lastName: data.createGuarantor.lastName,
          email: data.createGuarantor.email,
          document: data.createGuarantor.document,
          documentType: data.createGuarantor.documentType,
          phone: data.createGuarantor.phone,
          address: data.createGuarantor.address
        },
        document: data.document
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}
