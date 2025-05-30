'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Info, User, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Lead } from '@/types/leads.types';
import { motion } from 'framer-motion';

interface LeadInOfficeMessageProps {
  lead: Lead;
  onContinue: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LeadInOfficeMessage({ lead, onContinue }: LeadInOfficeMessageProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP 'a las' HH:mm", { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  const latestVisit =
    lead.visits && lead.visits.length > 0
      ? lead.visits.sort(
          (a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
        )[0]
      : null;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg dark:border-green-800 dark:from-green-950/50 dark:to-green-900/30">
        <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-100 to-green-200 dark:border-green-800/50 dark:from-green-900/50 dark:to-green-800/30">
          <motion.div variants={itemVariants}>
            <CardTitle className="flex items-center gap-3 text-xl text-green-800 dark:text-green-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-sm">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              Lead Actualmente en Oficina
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 pb-8">
          {/* Alert Message */}
          <motion.div variants={itemVariants}>
            <Alert className="border-green-300 bg-green-50/50 dark:border-green-800/60 dark:bg-green-900/20">
              <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                Este lead ya tiene una visita activa registrada en el sistema y se encuentra
                actualmente en las instalaciones.
              </AlertDescription>
            </Alert>
          </motion.div>

          {/* Lead Information Grid */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Main Lead Info */}
            <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-green-950/20">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 shadow-sm dark:from-green-900/50 dark:to-green-800/50">
                  <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {lead.fullName}
                    </h3>
                    <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
                      <MapPin className="mr-1 h-3 w-3" />
                      En oficina
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{lead.documentType}:</span>
                      <span>{lead.document}</span>
                    </div>
                    {lead.age && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{lead.age} años</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Information */}
            {latestVisit && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div
                  variants={itemVariants}
                  className="rounded-xl border border-green-200 bg-white p-4 shadow-sm dark:border-green-800 dark:bg-green-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Hora de ingreso
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatTime(latestVisit.arrivalTime)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-xl border border-green-200 bg-white p-4 shadow-sm dark:border-green-800 dark:bg-green-950/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Fecha de visita
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {format(new Date(latestVisit.arrivalTime), 'dd/MM/yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Contact Information */}
            {(lead.phone || lead.email) && (
              <motion.div variants={itemVariants}>
                <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm dark:border-green-800 dark:bg-green-950/20">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Información de contacto
                  </h4>
                  <div className="space-y-2">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Teléfono:
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">{lead.phone}</span>
                      </div>
                    )}
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-gray-100">{lead.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants} className="flex justify-end pt-4">
            <Button
              onClick={onContinue}
              className="h-12 bg-gradient-to-r from-green-600 to-green-700 px-8 text-white shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <User className="mr-2 h-5 w-5" />
              Ver y gestionar información del lead
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
