'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DOCUMENT_TYPES, MARITAL_STATUS_OPTIONS } from '../../constants';
import type { DocumentType, LeadSource, UbigeoItem } from '../../types';
import type { Project } from '@/features/sales/types';

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
  projects: Project[] | undefined;
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
  projects,
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

  const selectedProjects =
    projects?.filter((p) => interestProjects.includes(p.id)).map((p) => p.name) || [];

  return (
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Resumen</h2>
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Documento:</span>{' '}
              <span>
                {documentTypeLabel} - {document}
              </span>
            </div>
            <div>
              <span className="font-medium">Nombres:</span> <span>{firstName}</span>
            </div>
            <div>
              <span className="font-medium">Apellidos:</span> <span>{lastName}</span>
            </div>
            {email && (
              <div>
                <span className="font-medium">Email:</span> <span>{email}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Teléfono:</span> <span>{phone}</span>
            </div>
            {phone2 && (
              <div>
                <span className="font-medium">Teléfono 2:</span> <span>{phone2}</span>
              </div>
            )}
            {age && (
              <div>
                <span className="font-medium">Edad:</span> <span>{age} años</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Fuente:</span> <span>{sourceName}</span>
            </div>
            <div>
              <span className="font-medium">Ubicación:</span>{' '}
              <span>
                {districtName}, {provinceName}, {departmentName}
              </span>
            </div>
            {selectedProjects.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium">Proyectos de Interés:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProjects.map((projectName, index) => (
                    <Badge key={index} variant="secondary">
                      {projectName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Companion */}
        {hasCompanion && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Acompañante</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium">Nombre:</span> <span>{companionFullName}</span>
              </div>
              <div>
                <span className="font-medium">DNI:</span> <span>{companionDni}</span>
              </div>
              <div>
                <span className="font-medium">Parentesco:</span> <span>{companionRelationship}</span>
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Información Complementaria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {estadoCivil && (
              <div>
                <span className="font-medium">Estado Civil:</span> <span>{maritalStatusLabel}</span>
              </div>
            )}
            {ocupacion && (
              <div>
                <span className="font-medium">Ocupación:</span> <span>{ocupacion}</span>
              </div>
            )}
            {cantidadHijos && (
              <div>
                <span className="font-medium">Hijos:</span> <span>{cantidadHijos}</span>
              </div>
            )}
            {tieneTarjetasCredito && (
              <div>
                <span className="font-medium">Tarjetas de Crédito:</span>{' '}
                <span>{cantidadTarjetasCredito || 'Sí'}</span>
              </div>
            )}
            {tieneTarjetasDebito && (
              <div>
                <span className="font-medium">Tarjetas de Débito:</span>{' '}
                <span>{cantidadTarjetasDebito || 'Sí'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-2 border-t pt-4">
          <Label htmlFor="observations">Observaciones</Label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            placeholder="Ingrese observaciones adicionales (opcional)"
            rows={4}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Lead'}
          </Button>
        </div>
      </div>
    </div>
  );
}
