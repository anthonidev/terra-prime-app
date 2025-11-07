'use client';

import { motion } from 'framer-motion';
import { User, Phone, FileText, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { VendorLead } from '@/features/leads/types';
import type { ClientByDocumentResponse } from '../../../types';

interface LeadSelectorProps {
  selectedLeadId: string;
  vendorLeads: VendorLead[] | undefined;
  isLoadingLeads: boolean;
  selectedLead: VendorLead | undefined;
  clientData: ClientByDocumentResponse | null | undefined;
  isLoadingClient: boolean;
  onLeadSelect: (leadId: string) => void;
  error?: string;
}

export function LeadSelector({
  selectedLeadId,
  vendorLeads,
  isLoadingLeads,
  selectedLead,
  clientData,
  isLoadingClient,
  onLeadSelect,
  error,
}: LeadSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>
                Seleccione el lead y verifique la información del cliente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lead Select */}
          <div className="space-y-2">
            <Label htmlFor="leadId" className="text-sm font-medium">
              Seleccionar Lead <span className="text-destructive">*</span>
            </Label>
            {isLoadingLeads ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedLeadId} onValueChange={onLeadSelect}>
                <SelectTrigger id="leadId">
                  <SelectValue placeholder="Seleccione un lead" />
                </SelectTrigger>
                <SelectContent>
                  {vendorLeads?.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-muted-foreground">- {lead.document}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Lead Info Display */}
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Datos del Lead</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre completo</p>
                      <p className="text-sm font-semibold">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-start gap-2"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Documento</p>
                      <p className="text-sm font-semibold">{selectedLead.document}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-2"
                  >
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                      <p className="text-sm font-semibold">{selectedLead.phone}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-2"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fuente</p>
                      <Badge variant="secondary" className="text-xs">
                        {selectedLead.source?.name || 'N/A'}
                      </Badge>
                    </div>
                  </motion.div>
                </div>

                {/* Loading Client */}
                {isLoadingClient && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 pt-3 border-t border-primary/20 flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Verificando si el cliente existe...
                    </p>
                  </motion.div>
                )}

                {/* Existing Client Found */}
                {clientData && !isLoadingClient && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 pt-3 border-t border-primary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-600 font-semibold">
                        Cliente existente encontrado
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">Email:</span>
                        <span className="font-medium text-xs">{clientData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">Estado Civil:</span>
                        <span className="font-medium text-xs">{clientData.civilStatus || 'N/A'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
