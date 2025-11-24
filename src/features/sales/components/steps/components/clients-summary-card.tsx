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
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Users className="text-primary h-5 w-5" />
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
              className="bg-muted/30 rounded-lg p-4"
            >
              <div className="mb-4 flex items-center gap-2 border-b pb-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                  <User className="text-primary h-4 w-4" />
                </div>
                <h4 className="font-semibold">Cliente Principal</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                    Nombre
                  </p>
                  <p className="font-medium">{step4.leadName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                    Documento
                  </p>
                  <p className="font-medium">{step4.leadDocument || 'N/A'}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                    Dirección
                  </p>
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
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="mb-4 flex items-center gap-2 border-b pb-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                    <UserCheck className="text-primary h-4 w-4" />
                  </div>
                  <h4 className="font-semibold">Garante</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      Nombre
                    </p>
                    <p className="font-medium">
                      {step4.guarantor.firstName} {step4.guarantor.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      Documento
                    </p>
                    <p className="font-medium">{step4.guarantor.document}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      Teléfono
                    </p>
                    <p className="font-medium">{step4.guarantor.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      Email
                    </p>
                    <p className="font-medium">{step4.guarantor.email}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                      Dirección
                    </p>
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
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="mb-4 flex items-center gap-2 border-b pb-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                    <Users className="text-primary h-4 w-4" />
                  </div>
                  <h4 className="font-semibold">Clientes Secundarios</h4>
                  <Badge variant="secondary" className="text-xs">
                    {step4.secondaryClients.length}
                  </Badge>
                </div>
                <div className="space-y-4">
                  {step4.secondaryClients.map((client, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="bg-background rounded-lg border p-3 shadow-sm"
                    >
                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                            Nombre
                          </p>
                          <p className="font-medium">
                            {client.firstName} {client.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                            Documento
                          </p>
                          <p className="font-medium">{client.document}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                            Teléfono
                          </p>
                          <p className="font-medium">{client.phone}</p>
                        </div>
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
