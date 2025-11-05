'use client';

import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Info,
  Loader2,
  Target,
  User,
  Users,
} from 'lucide-react';

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
    <div className="space-y-3">
      {/* Personal Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
              <User className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-base">Datos Personales</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium text-muted-foreground">Documento:</span>{' '}
              <span>
                {documentTypeLabel} - {document}
              </span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Nombres:</span>{' '}
              <span>{firstName}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Apellidos:</span>{' '}
              <span>{lastName}</span>
            </div>
            {email && (
              <div>
                <span className="font-medium text-muted-foreground">Email:</span> <span>{email}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-muted-foreground">Teléfono:</span>{' '}
              <span>{phone}</span>
            </div>
            {phone2 && (
              <div>
                <span className="font-medium text-muted-foreground">Teléfono 2:</span>{' '}
                <span>{phone2}</span>
              </div>
            )}
            {age && (
              <div>
                <span className="font-medium text-muted-foreground">Edad:</span>{' '}
                <span>{age} años</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-info/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-info" />
            </div>
            <CardTitle className="text-base">Información Adicional</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Fuente:</span>{' '}
                <span>{sourceName}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Ubicación:</span>{' '}
                <span>
                  {districtName}, {provinceName}, {departmentName}
                </span>
              </div>
            </div>
            {selectedProjects.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Proyectos de Interés:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedProjects.map((projectName, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {projectName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Companion */}
      {hasCompanion && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <CardTitle className="text-base">Acompañante</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Nombre:</span>{' '}
                <span>{companionFullName}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">DNI:</span>{' '}
                <span>{companionDni}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Parentesco:</span>{' '}
                <span>{companionRelationship}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {(estadoCivil || ocupacion || cantidadHijos || tieneTarjetasCredito || tieneTarjetasDebito) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-info/20 flex items-center justify-center">
                <Info className="h-4 w-4 text-info" />
              </div>
              <CardTitle className="text-base">Información Complementaria</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {estadoCivil && (
                <div>
                  <span className="font-medium text-muted-foreground">Estado Civil:</span>{' '}
                  <span>{maritalStatusLabel}</span>
                </div>
              )}
              {ocupacion && (
                <div>
                  <span className="font-medium text-muted-foreground">Ocupación:</span>{' '}
                  <span>{ocupacion}</span>
                </div>
              )}
              {cantidadHijos && (
                <div>
                  <span className="font-medium text-muted-foreground">Hijos:</span>{' '}
                  <span>{cantidadHijos}</span>
                </div>
              )}
              {tieneTarjetasCredito && (
                <div>
                  <span className="font-medium text-muted-foreground">Tarjetas de Crédito:</span>{' '}
                  <span>{cantidadTarjetasCredito || 'Sí'}</span>
                </div>
              )}
              {tieneTarjetasDebito && (
                <div>
                  <span className="font-medium text-muted-foreground">Tarjetas de Débito:</span>{' '}
                  <span>{cantidadTarjetasDebito || 'Sí'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Observaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="observations" className="text-xs font-medium">
              Observaciones adicionales (opcional)
            </Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => onObservationsChange(e.target.value)}
              placeholder="Ingrese observaciones adicionales..."
              rows={4}
              className="text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Atrás
        </Button>
        <Button size="sm" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-3.5 w-3.5" />
              Registrar Lead
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
