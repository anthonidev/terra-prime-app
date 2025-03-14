import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types/leads.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, History, MapPin } from "lucide-react";

interface LeadVisitsProps {
  lead: Lead | null;
}

export default function LeadVisits({ lead }: LeadVisitsProps) {
  if (!lead || !lead.visits || lead.visits.length === 0) return null;

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: es });
  };

  // Formatear hora
  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "HH:mm", { locale: es });
  };

  // Calcular duración de la visita
  const calculateDuration = (
    arrivalTime: string,
    departureTime: string | null
  ) => {
    if (!departureTime) return "En curso";

    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const durationMs = departure.getTime() - arrival.getTime();

    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Historial de visitas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/20 hover:bg-secondary/30">
              <TableHead className="font-medium">Fecha</TableHead>
              <TableHead className="font-medium">Hora llegada</TableHead>
              <TableHead className="font-medium">Hora salida</TableHead>
              <TableHead className="font-medium">Duración</TableHead>
              <TableHead className="font-medium">Registrado por</TableHead>
              <TableHead className="font-medium">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lead.visits.map((visit, index) => (
              <TableRow
                key={visit.id}
                className={
                  index === 0 && !visit.departureTime
                    ? "bg-green-50/50 dark:bg-green-950/20"
                    : ""
                }
              >
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(visit.arrivalTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatTime(visit.arrivalTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {visit.departureTime ? (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatTime(visit.departureTime)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Pendiente
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {calculateDuration(
                    visit.arrivalTime,
                    visit.departureTime ?? null
                  )}
                </TableCell>
                <TableCell>
                  {visit.liner ? (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {visit.liner.firstName} {visit.liner.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No registrado
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {!visit.departureTime ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800">
                      <MapPin className="h-3 w-3 mr-1" />
                      En oficina
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Completada</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {lead.visits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay visitas registradas para este lead
          </div>
        )}
      </CardContent>
    </Card>
  );
}
