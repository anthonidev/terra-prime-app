'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MARITAL_STATUS_OPTIONS } from '../constants';
import type { LeadSource, UbigeoItem } from '../types';
import type { Project } from '@/features/sales/types';

interface AdditionalInfoStepProps {
  // Source
  sourceId: string;
  sources: LeadSource[] | undefined;
  onSourceChange: (value: string) => void;

  // Ubigeo
  departmentId: string;
  provinceId: string;
  districtId: string;
  departments: UbigeoItem[];
  provinces: UbigeoItem[];
  districts: UbigeoItem[];
  onDepartmentChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;

  // Projects
  interestProjects: string[];
  projects: Project[] | undefined;
  onProjectToggle: (projectId: string) => void;

  // Companion
  hasCompanion: boolean;
  companionFullName: string;
  companionDni: string;
  companionRelationship: string;
  onCompanionToggle: (checked: boolean) => void;
  onFieldChange: (field: string, value: string) => void;

  // Metadata
  estadoCivil: string;
  tieneTarjetasCredito: boolean;
  cantidadTarjetasCredito: string;
  tieneTarjetasDebito: boolean;
  cantidadTarjetasDebito: string;
  cantidadHijos: string;
  ocupacion: string;

  // Navigation
  onNext: () => void;
  onBack: () => void;
}

export function AdditionalInfoStep({
  sourceId,
  sources,
  onSourceChange,
  departmentId,
  provinceId,
  districtId,
  departments,
  provinces,
  districts,
  onDepartmentChange,
  onProvinceChange,
  onDistrictChange,
  interestProjects,
  projects,
  onProjectToggle,
  hasCompanion,
  companionFullName,
  companionDni,
  companionRelationship,
  onCompanionToggle,
  onFieldChange,
  estadoCivil,
  tieneTarjetasCredito,
  cantidadTarjetasCredito,
  tieneTarjetasDebito,
  cantidadTarjetasDebito,
  cantidadHijos,
  ocupacion,
  onNext,
  onBack,
}: AdditionalInfoStepProps) {
  const isValid = sourceId && districtId;

  return (
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Información Adicional</h2>
      <div className="space-y-6">
        {/* Source */}
        <div className="space-y-2">
          <Label htmlFor="source">
            Fuente <span className="text-destructive">*</span>
          </Label>
          <Select value={sourceId} onValueChange={onSourceChange}>
            <SelectTrigger id="source">
              <SelectValue placeholder="Seleccione una fuente" />
            </SelectTrigger>
            <SelectContent>
              {sources?.map((source) => (
                <SelectItem key={source.id} value={source.id.toString()}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ubigeo */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">
            Ubicación <span className="text-destructive">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={departmentId} onValueChange={onDepartmentChange}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Select
                value={provinceId}
                onValueChange={onProvinceChange}
                disabled={!departmentId}
              >
                <SelectTrigger id="province">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((prov) => (
                    <SelectItem key={prov.id} value={prov.id.toString()}>
                      {prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Distrito</Label>
              <Select value={districtId} onValueChange={onDistrictChange} disabled={!provinceId}>
                <SelectTrigger id="district">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist.id} value={dist.id.toString()}>
                      {dist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Interest Projects */}
        <div className="space-y-2">
          <Label>Proyectos de Interés</Label>
          <div className="space-y-2">
            {projects?.map((project) => (
              <div key={project.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`project-${project.id}`}
                  checked={interestProjects.includes(project.id)}
                  onCheckedChange={() => onProjectToggle(project.id)}
                />
                <label
                  htmlFor={`project-${project.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {project.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Companion */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCompanion"
              checked={hasCompanion}
              onCheckedChange={onCompanionToggle}
            />
            <label
              htmlFor="hasCompanion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ¿Viene acompañado?
            </label>
          </div>

          {hasCompanion && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="companionFullName">Nombre Completo</Label>
                <Input
                  id="companionFullName"
                  value={companionFullName}
                  onChange={(e) => onFieldChange('companionFullName', e.target.value)}
                  placeholder="Nombre del acompañante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companionDni">DNI</Label>
                <Input
                  id="companionDni"
                  value={companionDni}
                  onChange={(e) => onFieldChange('companionDni', e.target.value)}
                  placeholder="DNI del acompañante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companionRelationship">Parentesco</Label>
                <Input
                  id="companionRelationship"
                  value={companionRelationship}
                  onChange={(e) => onFieldChange('companionRelationship', e.target.value)}
                  placeholder="Ej: Esposo/a, Hijo/a"
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold">Información Complementaria</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select value={estadoCivil} onValueChange={(value) => onFieldChange('estadoCivil', value)}>
                <SelectTrigger id="estadoCivil">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocupacion">Ocupación</Label>
              <Input
                id="ocupacion"
                value={ocupacion}
                onChange={(e) => onFieldChange('ocupacion', e.target.value)}
                placeholder="Ocupación"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidadHijos">Cantidad de Hijos</Label>
              <Input
                id="cantidadHijos"
                type="number"
                value={cantidadHijos}
                onChange={(e) => onFieldChange('cantidadHijos', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tieneTarjetasCredito"
                checked={tieneTarjetasCredito}
                onCheckedChange={(checked) =>
                  onFieldChange('tieneTarjetasCredito', checked.toString())
                }
              />
              <label
                htmlFor="tieneTarjetasCredito"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ¿Tiene tarjetas de crédito?
              </label>
            </div>

            {tieneTarjetasCredito && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="cantidadTarjetasCredito">Cantidad</Label>
                <Input
                  id="cantidadTarjetasCredito"
                  type="number"
                  value={cantidadTarjetasCredito}
                  onChange={(e) => onFieldChange('cantidadTarjetasCredito', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tieneTarjetasDebito"
                checked={tieneTarjetasDebito}
                onCheckedChange={(checked) =>
                  onFieldChange('tieneTarjetasDebito', checked.toString())
                }
              />
              <label
                htmlFor="tieneTarjetasDebito"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ¿Tiene tarjetas de débito?
              </label>
            </div>

            {tieneTarjetasDebito && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="cantidadTarjetasDebito">Cantidad</Label>
                <Input
                  id="cantidadTarjetasDebito"
                  type="number"
                  value={cantidadTarjetasDebito}
                  onChange={(e) => onFieldChange('cantidadTarjetasDebito', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
