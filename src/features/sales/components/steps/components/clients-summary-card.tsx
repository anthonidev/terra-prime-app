'use client';

import { motion } from 'framer-motion';
import { Users, User, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Step4Data } from '../../../types';

interface ClientsSummaryCardProps {
  step4: Step4Data;
  hasGuarantor: boolean;
  hasSecondaryClients: boolean;
}

export function ClientsSummaryCard({
  step4,
  hasGuarantor,
  hasSecondaryClients,
}: ClientsSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Client */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold">Cliente Principal</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Nombre</p>
                  <p className="font-medium">{step4.leadName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Documento</p>
                  <p className="font-medium">{step4.leadDocument || 'N/A'}</p>
                </div>
                <div className="md:col-span-1 col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Dirección</p>
                  <p className="font-medium">{step4.clientAddress}</p>
                </div>
              </div>
            </motion.div>

            {/* Guarantor */}
            {hasGuarantor && step4.guarantor && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/20">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Garante</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm p-4 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg border border-green-500/20">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Nombre</p>
                    <p className="font-medium">
                      {step4.guarantor.firstName} {step4.guarantor.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Documento</p>
                    <p className="font-medium">{step4.guarantor.document}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Teléfono</p>
                    <p className="font-medium">{step4.guarantor.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Email</p>
                    <p className="font-medium">{step4.guarantor.email}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-muted-foreground text-xs mb-1">Dirección</p>
                    <p className="font-medium">{step4.guarantor.address}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Secondary Clients */}
            {hasSecondaryClients && step4.secondaryClients && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20">
                    <Users className="h-4 w-4 text-accent" />
                  </div>
                  <h4 className="font-semibold">Clientes Secundarios</h4>
                  <Badge variant="secondary" className="text-xs">
                    {step4.secondaryClients.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {step4.secondaryClients.map((client, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm p-4 bg-gradient-to-br from-accent/5 to-transparent rounded-lg border border-accent/20"
                    >
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Nombre</p>
                        <p className="font-medium">
                          {client.firstName} {client.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Documento</p>
                        <p className="font-medium">{client.document}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Teléfono</p>
                        <p className="font-medium">{client.phone}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
