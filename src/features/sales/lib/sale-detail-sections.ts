export type SaleDetailSectionId =
  | 'sale-info-card'
  | 'jve-actions'
  | 'adm-financing'
  | 'ven-register-payment'
  | 'cob-financing-installments'
  | 'sale-detail-tabs'
  | 'sale-detail-info';

export interface SectionDefinition {
  id: SaleDetailSectionId;
  label: string;
  roles: string[];
  defaultVisible: boolean;
}

export interface SectionLayoutItem {
  id: SaleDetailSectionId;
  visible: boolean;
}

export const SALE_DETAIL_SECTIONS: SectionDefinition[] = [
  {
    id: 'sale-info-card',
    label: 'Información de la Venta',
    roles: ['ADM', 'VEN', 'JVE', 'COB'],
    defaultVisible: true,
  },
  {
    id: 'jve-actions',
    label: 'Acciones de Gestión',
    roles: ['JVE'],
    defaultVisible: true,
  },
  {
    id: 'adm-financing',
    label: 'Administración de Financiamiento',
    roles: ['ADM'],
    defaultVisible: true,
  },
  {
    id: 'ven-register-payment',
    label: 'Registro de Pagos',
    roles: ['VEN'],
    defaultVisible: true,
  },
  {
    id: 'cob-financing-installments',
    label: 'Cuotas de Financiamiento',
    roles: ['COB'],
    defaultVisible: true,
  },
  {
    id: 'sale-detail-tabs',
    label: 'Pagos / Cuotas / Documentos',
    roles: ['ADM', 'VEN', 'JVE', 'COB'],
    defaultVisible: true,
  },
  {
    id: 'sale-detail-info',
    label: 'Información Detallada',
    roles: ['ADM', 'VEN', 'JVE', 'COB'],
    defaultVisible: true,
  },
];

export function getDefaultLayout(roleCode: string): SectionLayoutItem[] {
  return SALE_DETAIL_SECTIONS.filter((section) => section.roles.includes(roleCode)).map(
    (section) => ({
      id: section.id,
      visible: section.defaultVisible,
    })
  );
}
