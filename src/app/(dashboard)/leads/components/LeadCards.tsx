'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Lead } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  Clock,
  CreditCard,
  Eye,
  LogOut,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { registerDeparture } from '../action';

type Props = {
  data: Lead[];
};

const LeadCards = ({ data }: Props) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  const getLatestVisit = (lead: Lead) => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits.sort(
      (a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
    )[0];
  };

  const handleViewDetails = (leadId: string) => {
    router.push(`/leads/detalle/${leadId}`);
  };

  const handleRegisterDeparture = async (leadId: string) => {
    const lead = data.find((l) => l.id === leadId);
    if (!lead?.isInOffice) {
      toast.error('El lead no se encuentra en la oficina');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [leadId]: true }));

    try {
      const result = await registerDeparture(leadId);

      if (result.success) {
        toast.success('Salida registrada correctamente');
        router.refresh();
      } else {
        toast.error(result.error || 'Error al registrar la salida');
      }
    } catch {
      toast.error('Error al registrar la salida');
    } finally {
      setLoadingStates((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron leads
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((lead) => {
        const latestVisit = getLatestVisit(lead);
        const isLoading = loadingStates[lead.id] || false;

        return (
          <Card
            key={lead.id}
            className={`transition-all hover:shadow-md ${
              lead.isInOffice
                ? 'bg-green-50/30 ring-2 ring-green-200 dark:bg-green-950/20 dark:ring-green-800'
                : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.age ? `${lead.age} años` : 'Edad no registrada'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {lead.isInOffice ? (
                    <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
                      <MapPin className="mr-1 h-3 w-3" />
                      En oficina
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      No en oficina
                    </Badge>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(lead.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>

                      {lead.isInOffice && (
                        <DropdownMenuItem
                          onClick={() => handleRegisterDeparture(lead.id)}
                          disabled={isLoading}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {isLoading ? 'Registrando...' : 'Registrar salida'}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{lead.document}</span>
                  <span className="text-gray-500 dark:text-gray-400">({lead.documentType})</span>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Contacto</h4>
                <div className="space-y-1">
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                  )}
                  {lead.phone2 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{lead.phone2}</span>
                    </div>
                  )}
                  {!lead.phone && !lead.email && !lead.phone2 && (
                    <div className="text-sm text-gray-400">Sin datos de contacto</div>
                  )}
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                {lead.source && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Fuente: {lead.source.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Registrado: {formatDate(lead.createdAt)}</span>
                </div>

                {lead.isInOffice && latestVisit && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>En oficina desde: {formatTime(latestVisit.arrivalTime)}</span>
                  </div>
                )}

                {lead.ubigeo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Ubicación: {lead.ubigeo.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LeadCards;
