import {
  Award,
  Banknote,
  BarChart,
  BarChart2,
  ClipboardCheck,
  CreditCard,
  Crown,
  DollarSign,
  History,
  Home,
  Layers,
  MapPin,
  Medal,
  Package,
  PlaneTakeoff,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Trophy,
  User,
  UserCog,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";

export const ICON_MAPPING = {
  // Elementos principales
  dashboard: Home,
  profile: User,
  money: Wallet,
  wallet: CreditCard,

  // Membresía
  membership: Crown,
  "membership-plan": PlaneTakeoff,
  "my-plan": ClipboardCheck,
  reconsumos: Award,

  // Puntos
  points: Award,
  history: History,
  chart: BarChart,

  // Rangos
  ranks: Medal,
  "all-ranks": Layers,
  "my-ranks": Trophy,

  // Equipo
  team: Users,

  // Lotes
  "lotes-activos": MapPin,

  // Tienda
  store: ShoppingBag,
  products: Package,
  cart: ShoppingCart,
  orders: Receipt,

  // Admin
  users: UserCog,
  "membership-admin": Settings,
  "payments-admin": DollarSign,
  "withdrawals-admin": Banknote,
  "points-admin": Award,
  "ranks-admin": BarChart2,
  "team-admin": UsersRound,
};
