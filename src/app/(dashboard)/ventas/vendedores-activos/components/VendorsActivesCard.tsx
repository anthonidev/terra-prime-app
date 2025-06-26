import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { VendorsActives } from '@domain/entities/sales/leadsvendors.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  User,
  Mail,
  IdCard,
  MoreVertical,
  Star,
  TrendingUp,
  Clock,
  Check
} from 'lucide-react';

type Props = {
  data: VendorsActives[];
};

export default function VendorsActivesCard({ data }: Props) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600'
    ];
    const index = email.length % colors.length;
    return colors[index];
  };

  const isRecentVendor = (createdAt: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  if (!data.length) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            No hay vendedores activos
          </h3>
          <p className="mb-4 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Aún no se han registrado vendedores en el sistema. Los nuevos registros aparecerán aquí.
          </p>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Registrar vendedor
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Vendedores Activos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.length} {data.length === 1 ? 'vendedor registrado' : 'vendedores registrados'}
            </p>
          </div>
        </div>
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          <Check className="mr-1 h-3 w-3" />
          Todos activos
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((vendor, index) => {
          const initials = getInitials(vendor.firstName, vendor.lastName);
          const avatarGradient = getAvatarColor(vendor.email);
          const isRecent = isRecentVendor(vendor.createdAt);
          const vendorNumber = index + 1;

          return (
            <Card
              key={vendor.id}
              className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-3 left-3 z-10">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-gray-700 shadow-sm dark:bg-gray-800/90 dark:text-gray-300">
                  {vendorNumber}
                </div>
              </div>

              {isRecent && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    <Star className="mr-1 h-3 w-3" />
                    Nuevo
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-lg font-bold text-white shadow-lg`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {vendor.firstName} {vendor.lastName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                        <Mail className="h-3 w-3" />
                        <span className="max-w-44 truncate">{vendor.email}</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-orange-600">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Ver ventas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  {vendor.document && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <IdCard className="h-4 w-4" />
                        <span>Documento:</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {vendor.document}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Registrado:</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(vendor.createdAt), 'dd/MM/yyyy', { locale: es })}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(vendor.createdAt), 'HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Estado:</span>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                      Activo
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 group-hover:opacity-100"></div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Gestión de Vendedores</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Todos los vendedores mostrados están activos y disponibles para realizar ventas. Las
              estadísticas se actualizan en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
