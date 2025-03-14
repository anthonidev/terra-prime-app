import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lead } from "@/types/leads.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Building,
  Calendar,
  Clock,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

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
  isUpdating,
}: LeadDetailHeaderProps) {
  if (!lead) return null;

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: es });
  };

  // Formatear hora
  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "HH:mm", { locale: es });
  };

  // Obtener la última visita del lead
  const getLatestVisit = () => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits[0]; // Ya viene ordenado por fecha
  };

  const latestVisit = getLatestVisit();

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Columna de información principal */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {lead.firstName} {lead.lastName}
                  </h2>

                  {lead.isInOffice ? (
                    <Badge
                      className="bg-green-100 text-green-800 dark:bg-green-900/40 
                        dark:text-green-300 border-green-200 dark:border-green-800"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      En oficina
                    </Badge>
                  ) : (
                    <Badge variant="secondary">No en oficina</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
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

            {/* Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Información de contacto
                </h3>

                <div className="space-y-2">
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}

                  {lead.phone2 && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone2}</span>
                    </div>
                  )}

                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.email}</span>
                    </div>
                  )}

                  {!lead.phone && !lead.phone2 && !lead.email && (
                    <div className="text-sm text-muted-foreground">
                      No hay información de contacto registrada
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  Información adicional
                </h3>

                <div className="space-y-2">
                  {lead.source && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Fuente:{" "}
                        <span className="font-medium">{lead.source.name}</span>
                      </span>
                    </div>
                  )}

                  {lead.ubigeo && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Ubicación:{" "}
                        <span className="font-medium">{lead.ubigeo.name}</span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Registrado:{" "}
                      <span className="font-medium">
                        {formatDate(lead.createdAt)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Button onClick={onEditClick} className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Editar información
            </Button>

            {lead.isInOffice && latestVisit && (
              <>
                <Button
                  variant="default"
                  onClick={onRegisterDeparture}
                  disabled={isUpdating}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <Clock className="h-4 w-4 mr-2" />
                      Registrar salida
                    </>
                  )}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm text-center text-muted-foreground">
                        <Clock className="h-3 w-3 inline-block mr-1" />
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
