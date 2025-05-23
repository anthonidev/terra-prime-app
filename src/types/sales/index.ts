export interface VendorsActivesItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  photo: string;
  createdAt: string;
}

export interface LeadsByDayItem {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  phone2?: string;
  age?: number;
  createdAt: string;
  source: {
    id: number;
    name: string;
  };
  ubigeo: {
    id: number;
    name: string;
    code: string;
    parentId: number | null;
  };
  vendor:
    | string
    | {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        document: string;
      }
    | null;
}

export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface LeadsByDayResponse {
  items: LeadsByDayItem[];
  meta: PaginatedMeta;
}

export type AllVendorsActivesResponse = Array<VendorsActivesItem>;

export interface AssignLeadsToVendorDto {
  /**
   * Array
   * @minItems 1
   * @format uuid
   */
  leadsId: string[];

  /**
   * ID
   * @format uuid
   */
  vendorId: string;
}
