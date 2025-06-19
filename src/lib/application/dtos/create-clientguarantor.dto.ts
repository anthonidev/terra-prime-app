interface Client {
  leadId: string;
  address: string;
}

interface Guarantor {
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  address: string;
}

interface SecondaryClient {
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  address: string;
}

export interface CreateClientGuarantorDTO {
  createClient: Client;
  createGuarantor?: Guarantor;
  createSecondaryClient?: SecondaryClient[];
  document: string;
}
