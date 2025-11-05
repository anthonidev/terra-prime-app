'use client';

import { User, Phone, MapPin, FileText, Heart, Users, Info, ChevronDown, CreditCard } from 'lucide-react';
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
    <div className="flex justify-between items-start gap-2 py-0.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="text-xs font-medium text-foreground text-right">{value}</span>
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">Información Detallada</CardTitle>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Información Personal */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
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
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Contacto
                </h3>
                <div className="space-y-0.5">
                  <InfoItem label="Email" value={lead.email} />
                  <InfoItem label="Teléfono 1" value={lead.phone} />
                  <InfoItem label="Teléfono 2" value={lead.phone2} />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Ubicación
                </h3>
                <div className="space-y-0.5">
                  {lead.ubigeo ? (
                    <>
                      <InfoItem label="Ubigeo" value={lead.ubigeo.name} />
                      <InfoItem label="Código" value={lead.ubigeo.code} />
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin ubicación</p>
                  )}
                </div>
              </div>

              {/* Fuente */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Fuente
                </h3>
                <div className="space-y-0.5">
                  {lead.source ? (
                    <>
                      <InfoItem label="Nombre" value={lead.source.name} />
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-xs text-muted-foreground">Estado:</span>
                        <Badge variant={lead.source.isActive ? 'default' : 'secondary'} className="text-xs h-5">
                          {lead.source.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin fuente</p>
                  )}
                </div>
              </div>

              {/* Proyectos */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                  <Heart className="h-3.5 w-3.5 text-primary" />
                  Proyectos de Interés
                </h3>
                {lead.interestProjects && lead.interestProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {lead.interestProjects.map((project, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin proyectos</p>
                )}
              </div>

              {/* Metadata */}
              {lead.metadata && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground border-b pb-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                    Información Adicional
                  </h3>
                  <div className="space-y-0.5">
                    {lead.metadata.cantidadHijos !== undefined && (
                      <InfoItem label="Hijos" value={lead.metadata.cantidadHijos} />
                    )}
                    {lead.metadata.tieneTarjetasCredito !== undefined && (
                      <InfoItem
                        label="T. Crédito"
                        value={lead.metadata.tieneTarjetasCredito
                          ? `Sí${lead.metadata.cantidadTarjetasCredito ? ` (${lead.metadata.cantidadTarjetasCredito})` : ''}`
                          : 'No'
                        }
                      />
                    )}
                    {lead.metadata.tieneTarjetasDebito !== undefined && (
                      <InfoItem
                        label="T. Débito"
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
              <div className="mt-4 pt-4 border-t">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2 border-b pb-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Acompañante
                </h3>
                <div className="grid md:grid-cols-3 gap-x-4 gap-y-0.5">
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
