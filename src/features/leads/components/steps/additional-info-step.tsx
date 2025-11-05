'use client';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CreditCard,
  Heart,
  Info,
  MapPin,
  Target,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { MARITAL_STATUS_OPTIONS } from '../../constants';
import type { LeadSource, UbigeoItem } from '../../types';
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
  onProjectToggle: (projectName: string) => void;

  // Companion
  hasCompanion: boolean;
  companionFullName: string;
  companionDni: string;
  companionRelationship: string;
  onCompanionToggle: (checked: boolean) => void;
  onFieldChange: (field: string, value: string | boolean) => void;

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
    <div className="space-y-3">
      {/* Source */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-info/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-info" />
            </div>
            <CardTitle className="text-base">Fuente del Lead</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="source" className="text-xs font-medium">
              Fuente <span className="text-destructive">*</span>
            </Label>
            <Select value={sourceId} onValueChange={onSourceChange}>
              <SelectTrigger id="source" className="h-9 text-sm">
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
        </CardContent>
      </Card>

      {/* Ubigeo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">
                Ubicación <span className="text-destructive">*</span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs font-medium">
                Departamento
              </Label>
              <Select value={departmentId} onValueChange={onDepartmentChange}>
                <SelectTrigger id="department" className="h-9 text-sm">
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

            <div className="space-y-1.5">
              <Label htmlFor="province" className="text-xs font-medium">
                Provincia
              </Label>
              <Select
                value={provinceId}
                onValueChange={onProvinceChange}
                disabled={!departmentId}
              >
                <SelectTrigger id="province" className="h-9 text-sm">
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

            <div className="space-y-1.5">
              <Label htmlFor="district" className="text-xs font-medium">
                Distrito
              </Label>
              <Select value={districtId} onValueChange={onDistrictChange} disabled={!provinceId}>
                <SelectTrigger id="district" className="h-9 text-sm">
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
        </CardContent>
      </Card>

      {/* Interest Projects */}
      {projects && projects.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-success/20 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-success" />
              </div>
              <CardTitle className="text-base">Proyectos de Interés</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects?.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={interestProjects.includes(project.name)}
                    onCheckedChange={() => onProjectToggle(project.name)}
                  />
                  <label
                    htmlFor={`project-${project.id}`}
                    className="text-xs font-medium leading-none cursor-pointer"
                  >
                    {project.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companion */}
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
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCompanion"
                checked={hasCompanion}
                onCheckedChange={onCompanionToggle}
              />
              <label htmlFor="hasCompanion" className="text-xs font-medium cursor-pointer">
                ¿Viene acompañado?
              </label>
            </div>

            {hasCompanion && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companionFullName" className="text-xs font-medium">
                    Nombre Completo
                  </Label>
                  <Input
                    id="companionFullName"
                    value={companionFullName}
                    onChange={(e) => onFieldChange('companionFullName', e.target.value)}
                    placeholder="Nombre del acompañante"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companionDni" className="text-xs font-medium">
                    DNI
                  </Label>
                  <Input
                    id="companionDni"
                    value={companionDni}
                    onChange={(e) => onFieldChange('companionDni', e.target.value)}
                    placeholder="DNI del acompañante"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companionRelationship" className="text-xs font-medium">
                    Parentesco
                  </Label>
                  <Input
                    id="companionRelationship"
                    value={companionRelationship}
                    onChange={(e) => onFieldChange('companionRelationship', e.target.value)}
                    placeholder="Ej: Esposo/a, Hijo/a"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
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
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="estadoCivil" className="text-xs font-medium flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                  Estado Civil
                </Label>
                <Select
                  value={estadoCivil}
                  onValueChange={(value) => onFieldChange('estadoCivil', value)}
                >
                  <SelectTrigger id="estadoCivil" className="h-9 text-sm">
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

              <div className="space-y-1.5">
                <Label htmlFor="ocupacion" className="text-xs font-medium flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Ocupación
                </Label>
                <Input
                  id="ocupacion"
                  value={ocupacion}
                  onChange={(e) => onFieldChange('ocupacion', e.target.value)}
                  placeholder="Ocupación"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cantidadHijos" className="text-xs font-medium flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  Cantidad de Hijos
                </Label>
                <Input
                  id="cantidadHijos"
                  type="number"
                  value={cantidadHijos}
                  onChange={(e) => onFieldChange('cantidadHijos', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tieneTarjetasCredito"
                  checked={tieneTarjetasCredito}
                  onCheckedChange={(checked) =>
                    onFieldChange('tieneTarjetasCredito', checked === true)
                  }
                />
                <label
                  htmlFor="tieneTarjetasCredito"
                  className="text-xs font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  ¿Tiene tarjetas de crédito?
                </label>
              </div>

              {tieneTarjetasCredito && (
                <div className="space-y-1.5 pl-6">
                  <Label htmlFor="cantidadTarjetasCredito" className="text-xs font-medium">
                    Cantidad
                  </Label>
                  <Input
                    id="cantidadTarjetasCredito"
                    type="number"
                    value={cantidadTarjetasCredito}
                    onChange={(e) => onFieldChange('cantidadTarjetasCredito', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-9 text-sm max-w-[200px]"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tieneTarjetasDebito"
                  checked={tieneTarjetasDebito}
                  onCheckedChange={(checked) =>
                    onFieldChange('tieneTarjetasDebito', checked === true)
                  }
                />
                <label
                  htmlFor="tieneTarjetasDebito"
                  className="text-xs font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  ¿Tiene tarjetas de débito?
                </label>
              </div>

              {tieneTarjetasDebito && (
                <div className="space-y-1.5 pl-6">
                  <Label htmlFor="cantidadTarjetasDebito" className="text-xs font-medium">
                    Cantidad
                  </Label>
                  <Input
                    id="cantidadTarjetasDebito"
                    type="number"
                    value={cantidadTarjetasDebito}
                    onChange={(e) => onFieldChange('cantidadTarjetasDebito', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="h-9 text-sm max-w-[200px]"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Atrás
        </Button>
        <Button size="sm" onClick={onNext} disabled={!isValid}>
          Siguiente
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
