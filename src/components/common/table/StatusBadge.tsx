import { Badge } from '@components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
