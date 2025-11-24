'use client';

import { ArrowLeft, CheckCircle, FileText, Info, Loader2, Target, User, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { DOCUMENT_TYPES, MARITAL_STATUS_OPTIONS } from '../../constants';
import type { DocumentType, LeadSource } from '../../types';

interface SummaryStepProps {
  // Form data
  documentType: DocumentType;
  document: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone2: string;
  age: string;
  sourceId: string;
  sources: LeadSource[] | undefined;
  departmentName: string;
  provinceName: string;
  districtName: string;
  interestProjects: string[];
  hasCompanion: boolean;
  companionFullName: string;
  companionDni: string;
  companionRelationship: string;
  estadoCivil: string;
  tieneTarjetasCredito: boolean;
  cantidadTarjetasCredito: string;
  tieneTarjetasDebito: boolean;
  cantidadTarjetasDebito: string;
  cantidadHijos: string;
  ocupacion: string;
  observations: string;
  onObservationsChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function SummaryStep({
  documentType,
  document,
  firstName,
  lastName,
  email,
  phone,
  phone2,
  age,
  sourceId,
  sources,
  departmentName,
  provinceName,
  districtName,
  interestProjects,
  hasCompanion,
  companionFullName,
  companionDni,
  companionRelationship,
  estadoCivil,
  tieneTarjetasCredito,
  cantidadTarjetasCredito,
  tieneTarjetasDebito,
  cantidadTarjetasDebito,
  cantidadHijos,
  ocupacion,
  observations,
  onObservationsChange,
  onSubmit,
  onBack,
  isSubmitting,
}: SummaryStepProps) {
  const documentTypeLabel =
    DOCUMENT_TYPES.find((dt) => dt.value === documentType)?.label || documentType;
  const sourceName = sources?.find((s) => s.id.toString() === sourceId)?.name || '-';
  const maritalStatusLabel =
    MARITAL_STATUS_OPTIONS.find((ms) => ms.value === estadoCivil)?.label || estadoCivil;

  const selectedProjects = interestProjects;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <User className="text-accent h-4 w-4" />
                </div>
                <CardTitle className="text-base">Datos Personales</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                    Documento
                  </span>
                  <span className="font-medium">
                    {documentTypeLabel} - {document}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                    Nombre Completo
                  </span>
                  <span className="font-medium">
                    {firstName} {lastName}
                  </span>
                </div>
                {email && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Email
                    </span>
                    <span className="font-medium">{email}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                    Teléfono
                  </span>
                  <span className="font-medium">{phone}</span>
                </div>
                {phone2 && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Teléfono 2
                    </span>
                    <span className="font-medium">{phone2}</span>
                  </div>
                )}
                {age && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Edad
                    </span>
                    <span className="font-medium">{age} años</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-info/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Target className="text-info h-4 w-4" />
                </div>
                <CardTitle className="text-base">Información Adicional</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Fuente
                    </span>
                    <span className="font-medium">{sourceName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Ubicación
                    </span>
                    <span className="font-medium">
                      {districtName}, {provinceName}, {departmentName}
                    </span>
                  </div>
                </div>
                {selectedProjects.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Proyectos de Interés
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjects.map((projectName, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                          {projectName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Companion */}
          {hasCompanion && (
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Users className="text-accent h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Acompañante</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Nombre
                    </span>
                    <span className="font-medium">{companionFullName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      DNI
                    </span>
                    <span className="font-medium">{companionDni}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                      Parentesco
                    </span>
                    <span className="font-medium">{companionRelationship}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {(estadoCivil ||
            ocupacion ||
            cantidadHijos ||
            tieneTarjetasCredito ||
            tieneTarjetasDebito) && (
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-info/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Info className="text-info h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Información Complementaria</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {estadoCivil && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                        Estado Civil
                      </span>
                      <span className="font-medium">{maritalStatusLabel}</span>
                    </div>
                  )}
                  {ocupacion && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                        Ocupación
                      </span>
                      <span className="font-medium">{ocupacion}</span>
                    </div>
                  )}
                  {cantidadHijos && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                        Hijos
                      </span>
                      <span className="font-medium">{cantidadHijos}</span>
                    </div>
                  )}
                  {tieneTarjetasCredito && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                        Tarjetas de Crédito
                      </span>
                      <span className="font-medium">{cantidadTarjetasCredito || 'Sí'}</span>
                    </div>
                  )}
                  {tieneTarjetasDebito && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                        Tarjetas de Débito
                      </span>
                      <span className="font-medium">{cantidadTarjetasDebito || 'Sí'}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observations */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <FileText className="text-primary h-4 w-4" />
                </div>
                <CardTitle className="text-base">Observaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones adicionales (opcional)</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => onObservationsChange(e.target.value)}
                  placeholder="Ingrese observaciones adicionales..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="w-32">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Registrar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
