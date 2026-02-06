export const CATEGORY_META: Record<string, { description: string; colorClass: string }> = {
  'Gestión de Leads': {
    description: 'Administra prospectos, asignaciones y fuentes de captación.',
    colorClass: 'text-chart-2',
  },
  'Gestión de Proyectos': {
    description: 'Gestiona proyectos inmobiliarios y lotes disponibles.',
    colorClass: 'text-chart-3',
  },
  Ventas: {
    description: 'Crea y administra ventas, cuotas y seguimiento comercial.',
    colorClass: 'text-chart-4',
  },
  Principal: {
    description: 'Accesos generales del sistema.',
    colorClass: 'text-primary',
  },
};

export const QUICK_ACCESS_URLS = [
  '/leads/nuevo',
  '/ventas/crear-venta',
  '/leads',
  '/ventas/mis-ventas',
];
