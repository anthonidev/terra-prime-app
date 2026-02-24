'use client';

import {
  User,
  Phone,
  MapPin,
  FileText,
  Heart,
  Users,
  Info,
  ChevronDown,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Lead } from '../../types';

interface LeadInfoSectionsProps {
  lead: Lead;
}

function InfoItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      <span className="text-foreground text-right text-sm">{value}</span>
    </div>
  );
}

export function LeadInfoSections({ lead }: LeadInfoSectionsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Info className="text-primary h-4 w-4" />
                </div>
                <CardTitle className="text-base">Información Detallada</CardTitle>
              </div>
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Información Personal */}
              <div className="space-y-3">
                <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <User className="text-primary h-3.5 w-3.5" />
                  Información Personal
                </h3>
                <div className="space-y-0.5">
                  <InfoItem label="Nombre" value={lead.firstName} />
                  <InfoItem label="Apellido" value={lead.lastName} />
                  <InfoItem label="Tipo Doc" value={lead.documentType} />
                  <InfoItem label="Documento" value={lead.document} />
                  <InfoItem label="Edad" value={lead.age} />
                  {lead.metadata?.estadoCivil && (
                    <InfoItem label="Estado Civil" value={lead.metadata.estadoCivil} />
                  )}
                  {lead.metadata?.ocupacion && (
                    <InfoItem label="Ocupación" value={lead.metadata.ocupacion} />
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-3">
                <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <Phone className="text-primary h-3.5 w-3.5" />
                  Contacto
                </h3>
                <div className="space-y-0.5">
                  <InfoItem label="Email" value={lead.email} />
                  <InfoItem label="Teléfono 1" value={lead.phone} />
                  <InfoItem label="Teléfono 2" value={lead.phone2} />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3">
                <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <MapPin className="text-primary h-3.5 w-3.5" />
                  Ubicación
                </h3>
                <div className="space-y-0.5">
                  {lead.ubigeo ? (
                    <>
                      <InfoItem label="Ubigeo" value={lead.ubigeo.name} />
                      <InfoItem label="Código" value={lead.ubigeo.code} />
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs italic">Sin ubicación registrada</p>
                  )}
                </div>
              </div>

              {/* Fuente */}
              <div className="space-y-3">
                <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <FileText className="text-primary h-3.5 w-3.5" />
                  Fuente
                </h3>
                <div className="space-y-0.5">
                  {lead.source ? (
                    <>
                      <InfoItem label="Nombre" value={lead.source.name} />
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground text-xs font-medium">Estado</span>
                        <Badge
                          variant={lead.source.isActive ? 'default' : 'secondary'}
                          className={`h-5 px-2 text-[10px] font-medium shadow-none ${
                            lead.source.isActive
                              ? 'bg-success/10 text-success hover:bg-success/20 border-success/20'
                              : ''
                          }`}
                        >
                          {lead.source.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs italic">Sin fuente registrada</p>
                  )}
                </div>
              </div>

              {/* Proyectos */}
              <div className="space-y-3">
                <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                  <Heart className="text-primary h-3.5 w-3.5" />
                  Proyectos de Interés
                </h3>
                {lead.interestProjects && lead.interestProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lead.interestProjects.map((project, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-background text-xs font-normal shadow-sm"
                      >
                        {project}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs italic">Sin proyectos de interés</p>
                )}
              </div>

              {/* Metadata */}
              {lead.metadata && (
                <div className="space-y-3">
                  <h3 className="text-foreground flex items-center gap-2 border-b pb-2 text-xs font-semibold tracking-wider uppercase">
                    <CreditCard className="text-primary h-3.5 w-3.5" />
                    Información Adicional
                  </h3>
                  <div className="space-y-0.5">
                    {lead.metadata.cantidadHijos !== undefined && (
                      <InfoItem label="Hijos" value={lead.metadata.cantidadHijos} />
                    )}
                    {lead.metadata.ingresoPromedioFamiliar !== undefined && (
                      <InfoItem
                        label="Ingreso Familiar"
                        value={lead.metadata.ingresoPromedioFamiliar}
                      />
                    )}
                    {lead.metadata.tieneTarjetasCredito !== undefined && (
                      <InfoItem
                        label="T. Crédito"
                        value={
                          lead.metadata.tieneTarjetasCredito
                            ? `Sí${lead.metadata.cantidadTarjetasCredito ? ` (${lead.metadata.cantidadTarjetasCredito})` : ''}`
                            : 'No'
                        }
                      />
                    )}
                    {lead.metadata.tieneTarjetasDebito !== undefined && (
                      <InfoItem
                        label="T. Débito"
                        value={
                          lead.metadata.tieneTarjetasDebito
                            ? `Sí${lead.metadata.cantidadTarjetasDebito ? ` (${lead.metadata.cantidadTarjetasDebito})` : ''}`
                            : 'No'
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acompañantes - Full width si existen */}
            {(() => {
              const lastVisit = lead.visits?.length ? lead.visits[lead.visits.length - 1] : null;
              const companions = lastVisit?.companions;
              if (!companions || companions.length === 0) return null;
              return (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-foreground mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                    <Users className="text-primary h-3.5 w-3.5" />
                    {companions.length === 1 ? 'Acompañante' : 'Acompañantes'}
                  </h3>
                  <div className="space-y-3">
                    {companions.map((companion, index) => (
                      <div key={index} className="grid gap-x-8 gap-y-2 md:grid-cols-3">
                        <InfoItem label="Nombre Completo" value={companion.fullName} />
                        <InfoItem label="DNI" value={companion.dni} />
                        <InfoItem label="Relación" value={companion.relationship} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
