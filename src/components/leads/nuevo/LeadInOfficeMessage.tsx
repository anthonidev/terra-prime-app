"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Info, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Lead } from "@/types/leads.types";

interface LeadInOfficeMessageProps {
  lead: Lead;
  onContinue: () => void;
}

export default function LeadInOfficeMessage({
  lead,
  onContinue,
}: LeadInOfficeMessageProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
  };

  // Encontrar la visita más reciente
  const latestVisit =
    lead.visits && lead.visits.length > 0
      ? lead.visits.sort(
          (a, b) =>
            new Date(b.arrivalTime).getTime() -
            new Date(a.arrivalTime).getTime()
        )[0]
      : null;

  return (
    <Card className="border-green-300 dark:border-green-800">
      <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800/50">
        <CardTitle className="text-lg flex items-center gap-2 text-green-800 dark:text-green-300">
          <CheckCircle className="h-5 w-5" />
          Lead Actualmente en Oficina
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <Alert className="bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/60 mb-4">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            Este lead ya tiene una visita activa registrada en el sistema.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lead</p>
                <p className="font-medium">{lead.fullName}</p>
              </div>
            </div>

            {latestVisit && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresó</p>
                  <p className="font-medium">
                    {formatDate(latestVisit.arrivalTime)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={onContinue}
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Ver detalles del lead
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
