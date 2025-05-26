export interface ProyectsActivesItems {
  id: string;
  name: string;
  currency: string;
  logo: string | null;
  logoPublicId: string | null;
  projectCode: string | null;
  createdAt: string;
}

export interface ProyectStagesItems {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProyectBlocksItems {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProyectLotsItems {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export type ProyectsActivesResponse = ProyectsActivesItems[];
export type ProyectStagesResponse = ProyectStagesItems[];
export type ProyectBlocksResponse = ProyectBlocksItems[];
export type ProyectLotsResponse = ProyectLotsItems[];

export interface ProyectStagesDTO {
  id: string;
}

export interface ProyectBlocksDTO {
  id: string;
}

export interface ProyectLotsDTO {
  id: string;
}
