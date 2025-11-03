export interface Vendor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  photo: string;
  createdAt: string;
}

export type VendorsActivesResponse = Vendor[];
