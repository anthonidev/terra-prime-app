import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building, Calendar, Clock, Edit, FileText, Mail, MapPin, Phone, User } from 'lucide-react';
interface LeadDetailHeaderProps {
  lead: Lead | null;
  onEditClick: () => void;
  onRegisterDeparture: () => Promise<boolean>;
  isUpdating: boolean;
}
export default function LeadDetailHeader({
  lead,
  onEditClick,
  onRegisterDeparture,
  isUpdating
}: LeadDetailHeaderProps) {
  if (!lead) return null;
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };
  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), 'HH:mm', { locale: es });
  };
  const getLatestVisit = () => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits[0];
  };
  const latestVisit = getLatestVisit();
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          {}
          <div className="flex-1">
            <div className="mb-4 flex items-start gap-4">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <User className="text-primary h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  {lead.isInOffice ? (
                    <Badge className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
                      <MapPin className="mr-1 h-3 w-3" />
                      En oficina
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No en oficina</Badge>
                  )}
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>
                    {lead.documentType}: {lead.document}
                  </span>
                  {lead.age && (
                    <>
                      <span className="mx-1">•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{lead.age} años</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-md flex items-center gap-2 font-medium">
                  <Phone className="text-primary h-4 w-4" />
                  Información de contacto
                </h3>
                <div className="space-y-2">
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.phone2 && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <span>{lead.phone2}</span>
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  {!lead.phone && !lead.phone2 && !lead.email && (
                    <div className="text-muted-foreground text-sm">
                      No hay información de contacto registrada
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-md flex items-center gap-2 font-medium">
                  <Building className="text-primary h-4 w-4" />
                  Información adicional
                </h3>
                <div className="space-y-2">
                  {lead.source && (
                    <div className="flex items-center gap-2">
                      <Building className="text-muted-foreground h-4 w-4" />
                      <span>
                        Fuente: <span className="font-medium">{lead.source.name}</span>
                      </span>
                    </div>
                  )}
                  {lead.ubigeo && (
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <span>
                        Ubicación: <span className="font-medium">{lead.ubigeo.name}</span>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span>
                      Registrado: <span className="font-medium">{formatDate(lead.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="flex min-w-[200px] flex-col gap-3">
            <Button onClick={onEditClick} className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Editar información
            </Button>
            {lead.isInOffice && latestVisit && (
              <>
                <Button
                  variant="default"
                  onClick={onRegisterDeparture}
                  disabled={isUpdating}
                  className="w-full bg-amber-600 text-white hover:bg-amber-700"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Registrar salida
                    </>
                  )}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-muted-foreground text-center text-sm">
                        <Clock className="mr-1 inline-block h-3 w-3" />
                        Ingresó: {formatTime(latestVisit.arrivalTime)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatDate(latestVisit.arrivalTime)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
