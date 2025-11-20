import {
  BarChart2,
  Briefcase,
  CreditCard,
  FolderKanban,
  FolderPlus,
  Handshake,
  Home,
  KanbanSquare,
  LandPlot,
  MapPin,
  RadioTower,
  ShoppingBag,
  ShoppingCart,
  User,
  UserCog,
  UserPlus,
  UserSearch,
  Users,
} from 'lucide-react';

export const ICON_MAPPING = {
  // Main
  dashboard: Home,
  welcome: Handshake,
  profile: User,
  pagos: CreditCard,
  users: UserCog,

  // Leads
  'g-lead': BarChart2,
  pin: MapPin,
  'welcome-assign': UserSearch, // Prospectos
  'lead-source': RadioTower,
  'new-lead': UserPlus,
  leads: Users,

  // Projects
  'g-project': KanbanSquare,
  'lote-available': LandPlot, // Lotes
  lote: FolderPlus, // Nuevo Proyecto
  project: FolderKanban,

  // Sales
  vendedores: Briefcase,
  participants: Users,
  'create-sale': ShoppingCart,
  ventas: ShoppingBag,
};

export const MENU_ITEMS = [
  { name: 'Dashboard', icon: 'dashboard', url: '/' },
  { name: 'Bienvenidos', icon: 'welcome', url: '/leads/asignacion' },
  { name: 'Vendedores', icon: 'vendedores', url: '/ventas/vendedores' },
  { name: 'Participantes', icon: 'participants', url: '/participantes' },
  {
    name: 'Gestión de Leads',
    icon: 'g-lead',
    children: [
      { name: 'Leads', icon: 'leads', url: '/leads' },
      { name: 'Pin', icon: 'pin', url: '/pin' },
      {
        name: 'Prospectos',
        icon: 'welcome-assign',
        url: '/leads/mis-prospectos',
      },
      {
        name: 'Fuentes de Leads',
        icon: 'lead-source',
        url: '/leads/fuentes',
      },
      { name: 'Nuevo Lead', icon: 'new-lead', url: '/leads/nuevo' },
    ],
  },
  {
    name: 'Gestión de Proyectos',
    icon: 'g-project',
    children: [
      {
        name: 'Lotes',
        icon: 'lote-available',
        url: '/proyectos/lotes-disponibles',
      },
      {
        name: 'Nuevo Proyecto',
        icon: 'lote',
        url: '/proyectos/nuevo',
      },
      { name: 'Proyectos', icon: 'project', url: '/proyectos' },
    ],
  },
  {
    name: 'Ventas',
    icon: 'ventas',
    children: [
      {
        name: 'Crear Ventas',
        icon: 'create-sale',
        url: '/ventas/crear-venta',
      },
      { name: 'Mis Ventas', icon: 'ventas', url: '/ventas/mis-ventas' },
      { name: 'Ventas Admin', icon: 'ventas', url: '/ventas/admin' },
    ],
  },
  { name: 'Perfil', icon: 'profile', url: '/perfil' },
  { name: 'Pagos', icon: 'pagos', url: '/pagos' },
  { name: 'Usuarios', icon: 'users', url: '/usuarios' },
];
