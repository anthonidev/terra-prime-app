import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Lead } from "@/types/leads.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  Eye,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface LeadTableRowProps {
  lead: Lead;
  onViewDetails: (id: string) => void;
  onRegisterDeparture: (id: string) => void;
}
export default function LeadTableRow({
  lead,
  onViewDetails,
  onRegisterDeparture,
}: LeadTableRowProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
  };
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: es });
  };
  const hasContactInfo = () => {
    return lead.email || lead.phone || lead.phone2;
  };
  const getLatestVisit = () => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits.sort(
      (a, b) =>
        new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
    )[0];
  };
  const latestVisit = getLatestVisit();
  return (
    <TableRow
      className={`${lead.isInOffice ? "bg-green-50/50 dark:bg-green-950/20" : ""}`}
    >
      {}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {lead.age ? `${lead.age} años` : "Edad no registrada"}
            </div>
          </div>
        </div>
      </TableCell>
      {}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{lead.document}</span>
          <span className="text-xs text-muted-foreground">
            {lead.documentType}
          </span>
        </div>
      </TableCell>
      {}
      <TableCell>
        {hasContactInfo() ? (
          <div className="flex flex-col gap-1">
            {lead.phone && (
              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate max-w-[130px]">{lead.email}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            Sin datos de contacto
          </span>
        )}
      </TableCell>
      {}
      <TableCell>
        {lead.source ? (
          <div className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm">{lead.source.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No especificada</span>
        )}
      </TableCell>
      {}
      <TableCell>
        {lead.isInOffice ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800">
            <MapPin className="h-3 w-3 mr-1" />
            En oficina
          </Badge>
        ) : (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            No en oficina
          </Badge>
        )}
        {lead.isInOffice && latestVisit && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(latestVisit.arrivalTime)}
          </div>
        )}
      </TableCell>
      {}
      <TableCell>
        <div className="text-sm">{formatDate(lead.createdAt)}</div>
        <div className="text-xs text-muted-foreground">
          {formatTime(lead.createdAt)}
        </div>
      </TableCell>
      {}
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onViewDetails(lead.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {lead.isInOffice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                    onClick={() => onRegisterDeparture(lead.id)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Registrar salida</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
