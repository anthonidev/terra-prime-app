import { Badge } from '@components/ui/badge';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Headphones,
  ShieldCheck,
  User,
  Users,
  XCircle
} from 'lucide-react';

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'upcoming':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <Clock className="h-3 w-3" />
          <span>Proximo</span>
        </Badge>
      );
    case 'RESERVATION_PENDING':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <Clock className="h-3 w-3" />
          <span>Separación Pendiente</span>
        </Badge>
      );
    case 'RESERVATION_PENDING_APPROVAL':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <Clock className="h-3 w-3" />
          <div className="flex flex-col">
            <span>Separación</span>
            <span>Pendiente de aprobación</span>
          </div>
        </Badge>
      );
    case 'pending':
    case 'PENDING':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <Clock className="h-3 w-3" />
          <span>Pendiente</span>
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Aprobado</span>
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-red-200 bg-red-50 px-2 py-0.5 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
        >
          <XCircle className="h-3 w-3" />
          <span>Rechazado</span>
        </Badge>
      );
    case 'ACTIVE':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Activo</span>
        </Badge>
      );
    case 'paid':
    case 'PAID':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Pagado</span>
        </Badge>
      );
    case 'INACTIVE':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700 dark:border-gray-800/40 dark:bg-gray-900/20 dark:text-gray-400"
        >
          <XCircle className="h-3 w-3" />
          <span>Inactivo</span>
        </Badge>
      );
    case 'EXPIRED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-red-200 bg-red-50 px-2 py-0.5 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
        >
          <XCircle className="h-3 w-3" />
          <span>Expirado</span>
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Completado</span>
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-red-200 bg-red-50 px-2 py-0.5 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
        >
          <XCircle className="h-3 w-3" />
          <span>Cancelado</span>
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-red-200 bg-red-50 px-2 py-0.5 text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
        >
          <XCircle className="h-3 w-3" />
          <span>Fallido</span>
        </Badge>
      );
    case 'PROCESSED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Procesado</span>
        </Badge>
      );
    case 'PENDING_APPROVAL':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Procesado</span>
        </Badge>
      );
    case 'WITHDRAWN':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Procesado</span>
        </Badge>
      );
    case 'IN_PAYMENT_PROCESS':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Procesado</span>
        </Badge>
      );
    case 'DIRECT_PAYMENT':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-purple-200 bg-purple-50 px-2 py-0.5 text-purple-700 dark:border-purple-800/40 dark:bg-purple-900/20 dark:text-purple-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Directo</span>
        </Badge>
      );
    case 'FINANCED':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Financiado</span>
        </Badge>
      );
    case 'LINER':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-cyan-200 bg-cyan-50 px-2 py-0.5 text-cyan-700 dark:border-cyan-800/40 dark:bg-cyan-900/20 dark:text-cyan-400"
        >
          <Users className="h-3 w-3" />
          <span>Liner</span>
        </Badge>
      );

    case 'TELEMARKETING_SUPERVISOR':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <ShieldCheck className="h-3 w-3" />
          <span>Sup. Telemarketing</span>
        </Badge>
      );

    case 'TELEMARKETING_CONFIRMER':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-yellow-200 bg-yellow-50 px-2 py-0.5 text-yellow-700 dark:border-yellow-800/40 dark:bg-yellow-900/20 dark:text-yellow-400"
        >
          <CheckCircle className="h-3 w-3" />
          <span>Confirmador</span>
        </Badge>
      );

    case 'TELEMARKETER':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-pink-200 bg-pink-50 px-2 py-0.5 text-pink-700 dark:border-pink-800/40 dark:bg-pink-900/20 dark:text-pink-400"
        >
          <Headphones className="h-3 w-3" />
          <span>Telemarketer</span>
        </Badge>
      );

    case 'FIELD_MANAGER':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <Briefcase className="h-3 w-3" />
          <span>Jefe de Campo</span>
        </Badge>
      );

    case 'FIELD_SUPERVISOR':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-indigo-200 bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-900/20 dark:text-indigo-400"
        >
          <User className="h-3 w-3" />
          <span>Supervisor de Campo</span>
        </Badge>
      );

    case 'FIELD_SELLER':
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1.5 border-green-200 bg-green-50 px-2 py-0.5 text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400"
        >
          <User className="h-3 w-3" />
          <span>Vendedor de Campo</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
