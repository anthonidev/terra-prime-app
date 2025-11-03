'use client';

import { User, Phone, MapPin, FileText, Heart, Users, Info, ChevronDown, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Lead } from '../types';

interface LeadInfoSectionsProps {
  lead: Lead;
}

function InfoItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex justify-between items-start gap-2 py-1">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}:</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

export function LeadInfoSections({ lead }: LeadInfoSectionsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Información Detallada del Lead
              </CardTitle>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Información Personal */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                  <User className="h-4 w-4 text-primary" />
                  Información Personal
                </h3>
                <div className="space-y-1">
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
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Información de Contacto
                </h3>
                <div className="space-y-1">
                  <InfoItem label="Email" value={lead.email} />
                  <InfoItem label="Teléfono 1" value={lead.phone} />
                  <InfoItem label="Teléfono 2" value={lead.phone2} />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Ubicación
                </h3>
                <div className="space-y-1">
                  {lead.ubigeo ? (
                    <>
                      <InfoItem label="Ubigeo" value={lead.ubigeo.name} />
                      <InfoItem label="Código" value={lead.ubigeo.code} />
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin ubicación</p>
                  )}
                </div>
              </div>

              {/* Fuente */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Fuente
                </h3>
                <div className="space-y-1">
                  {lead.source ? (
                    <>
                      <InfoItem label="Nombre" value={lead.source.name} />
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-muted-foreground">Estado:</span>
                        <Badge variant={lead.source.isActive ? 'default' : 'secondary'}>
                          {lead.source.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin fuente</p>
                  )}
                </div>
              </div>

              {/* Proyectos */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Proyectos de Interés
                </h3>
                {lead.interestProjects && lead.interestProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {lead.interestProjects.map((project, index) => (
                      <Badge key={index} variant="outline">
                        {project}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin proyectos</p>
                )}
              </div>

              {/* Metadata */}
              {lead.metadata && (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Información Adicional
                  </h3>
                  <div className="space-y-1">
                    {lead.metadata.cantidadHijos !== undefined && (
                      <InfoItem label="Cantidad de Hijos" value={lead.metadata.cantidadHijos} />
                    )}
                    {lead.metadata.tieneTarjetasCredito !== undefined && (
                      <InfoItem
                        label="Tarjetas de Crédito"
                        value={lead.metadata.tieneTarjetasCredito
                          ? `Sí${lead.metadata.cantidadTarjetasCredito ? ` (${lead.metadata.cantidadTarjetasCredito})` : ''}`
                          : 'No'
                        }
                      />
                    )}
                    {lead.metadata.tieneTarjetasDebito !== undefined && (
                      <InfoItem
                        label="Tarjetas de Débito"
                        value={lead.metadata.tieneTarjetasDebito
                          ? `Sí${lead.metadata.cantidadTarjetasDebito ? ` (${lead.metadata.cantidadTarjetasDebito})` : ''}`
                          : 'No'
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acompañante - Full width si existe */}
            {(lead.companionFullName || lead.companionDni || lead.companionRelationship) && (
              <div className="mt-6 pt-6 border-t md:col-span-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3 border-b pb-2">
                  <Users className="h-4 w-4 text-primary" />
                  Información del Acompañante
                </h3>
                <div className="grid md:grid-cols-3 gap-x-6 gap-y-1">
                  <InfoItem label="Nombre Completo" value={lead.companionFullName} />
                  <InfoItem label="DNI" value={lead.companionDni} />
                  <InfoItem label="Relación" value={lead.companionRelationship} />
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
