enum StatusSale {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface SalesItem {
  id: string;
  client: Client;
  type: SalesType;
  lot: Lot;
  vendor: User;
  initialAmount: number;
  totalAmount: number;
  status: StatusSale;
  financing?: Financing;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SalesResponse {
  items: SalesItem[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Client {
  id: string;
  sales?: SalesItem[];
}

export interface SalesType {
  id: string;
  sales?: SalesItem[];
}

export interface Lot {
  id: string;
  sales?: SalesItem[];
}

export interface User {
  id: string;
  sales?: SalesItem[];
}

export interface Financing {
  id: string;
  type: SalesType;
}
