'use client';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CreditCard,
  Heart,
  Info,
  MapPin,
  Plus,
  Target,
  Trash2,
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
import type { CompanionFormData } from '../../hooks/use-lead-form-state';
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

  // Companions
  companions: CompanionFormData[];
  onAddCompanion: () => void;
  onRemoveCompanion: (index: number) => void;
  onUpdateCompanion: (index: number, field: keyof CompanionFormData, value: string) => void;
  onFieldChange: (field: string, value: string | boolean) => void;

  // Metadata
  estadoCivil: string;
  tieneTarjetasCredito: boolean;
  cantidadTarjetasCredito: string;
  tieneTarjetasDebito: boolean;
  cantidadTarjetasDebito: string;
  cantidadHijos: string;
  ocupacion: string;
  ingresoPromedioFamiliar: string;

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
  companions,
  onAddCompanion,
  onRemoveCompanion,
  onUpdateCompanion,
  onFieldChange,
  estadoCivil,
  tieneTarjetasCredito,
  cantidadTarjetasCredito,
  tieneTarjetasDebito,
  cantidadTarjetasDebito,
  cantidadHijos,
  ocupacion,
  ingresoPromedioFamiliar,
  onNext,
  onBack,
}: AdditionalInfoStepProps) {
  const isValid = sourceId && districtId;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Source */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-info/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Target className="text-info h-4 w-4" />
                </div>
                <CardTitle className="text-base">Fuente del Lead</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="source">
                  Fuente <span className="text-destructive">*</span>
                </Label>
                <Select value={sourceId} onValueChange={onSourceChange}>
                  <SelectTrigger id="source" className="h-10">
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
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <MapPin className="text-primary h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Ubicación <span className="text-destructive">*</span>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={departmentId} onValueChange={onDepartmentChange}>
                    <SelectTrigger id="department" className="h-10">
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
                    <SelectTrigger id="province" className="h-10">
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
                  <Select
                    value={districtId}
                    onValueChange={onDistrictChange}
                    disabled={!provinceId}
                  >
                    <SelectTrigger id="district" className="h-10">
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
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-success/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Briefcase className="text-success h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Proyectos de Interés</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {projects?.map((project) => (
                    <div
                      key={project.id}
                      className="hover:bg-muted/50 flex items-center space-x-3 rounded-md border p-3 transition-colors"
                    >
                      <Checkbox
                        id={`project-${project.id}`}
                        checked={interestProjects.includes(project.name)}
                        onCheckedChange={() => onProjectToggle(project.name)}
                      />
                      <label
                        htmlFor={`project-${project.id}`}
                        className="cursor-pointer text-sm leading-none font-medium"
                      >
                        {project.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Companions */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Users className="text-accent h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Acompañantes</CardTitle>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onAddCompanion}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {companions.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No se han agregado acompañantes
                </p>
              ) : (
                <div className="space-y-4">
                  {companions.map((companion, index) => (
                    <div key={index} className="border-muted space-y-3 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs font-medium">
                          Acompañante {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                          onClick={() => onRemoveCompanion(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`companion-name-${index}`}>Nombre Completo</Label>
                        <Input
                          id={`companion-name-${index}`}
                          value={companion.fullName}
                          onChange={(e) => onUpdateCompanion(index, 'fullName', e.target.value)}
                          placeholder="Nombre del acompañante"
                          className="h-10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`companion-dni-${index}`}>DNI</Label>
                          <Input
                            id={`companion-dni-${index}`}
                            value={companion.dni}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                onUpdateCompanion(index, 'dni', value);
                              }
                            }}
                            placeholder="DNI"
                            className="h-10"
                            maxLength={8}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`companion-rel-${index}`}>Parentesco</Label>
                          <Input
                            id={`companion-rel-${index}`}
                            value={companion.relationship}
                            onChange={(e) =>
                              onUpdateCompanion(index, 'relationship', e.target.value)
                            }
                            placeholder="Ej: Esposo/a"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="estadoCivil" className="flex items-center gap-2">
                      <Heart className="text-muted-foreground h-4 w-4" />
                      Estado Civil
                    </Label>
                    <Select
                      value={estadoCivil}
                      onValueChange={(value) => onFieldChange('estadoCivil', value)}
                    >
                      <SelectTrigger id="estadoCivil" className="h-10">
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
                    <Label htmlFor="ocupacion" className="flex items-center gap-2">
                      <Briefcase className="text-muted-foreground h-4 w-4" />
                      Ocupación
                    </Label>
                    <Input
                      id="ocupacion"
                      value={ocupacion}
                      onChange={(e) => onFieldChange('ocupacion', e.target.value)}
                      placeholder="Ocupación"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cantidadHijos" className="flex items-center gap-2">
                      <Users className="text-muted-foreground h-4 w-4" />
                      Cantidad de Hijos
                    </Label>
                    <Input
                      id="cantidadHijos"
                      type="number"
                      value={cantidadHijos}
                      onChange={(e) => onFieldChange('cantidadHijos', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingresoPromedioFamiliar" className="flex items-center gap-2">
                      Ingreso Promedio Familiar
                    </Label>
                    <Input
                      id="ingresoPromedioFamiliar"
                      type="number"
                      value={ingresoPromedioFamiliar}
                      onChange={(e) => onFieldChange('ingresoPromedioFamiliar', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="bg-border h-px" />

                <div className="space-y-4">
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
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                      >
                        <CreditCard className="text-muted-foreground h-4 w-4" />
                        ¿Tiene tarjetas de crédito?
                      </label>
                    </div>

                    {tieneTarjetasCredito && (
                      <div className="pl-6">
                        <Label htmlFor="cantidadTarjetasCredito" className="mb-1.5 block text-xs">
                          Cantidad
                        </Label>
                        <Input
                          id="cantidadTarjetasCredito"
                          type="number"
                          value={cantidadTarjetasCredito}
                          onChange={(e) => onFieldChange('cantidadTarjetasCredito', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="h-9 max-w-[120px]"
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
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                      >
                        <CreditCard className="text-muted-foreground h-4 w-4" />
                        ¿Tiene tarjetas de débito?
                      </label>
                    </div>

                    {tieneTarjetasDebito && (
                      <div className="pl-6">
                        <Label htmlFor="cantidadTarjetasDebito" className="mb-1.5 block text-xs">
                          Cantidad
                        </Label>
                        <Input
                          id="cantidadTarjetasDebito"
                          type="number"
                          value={cantidadTarjetasDebito}
                          onChange={(e) => onFieldChange('cantidadTarjetasDebito', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="h-9 max-w-[120px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
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
        <Button onClick={onNext} disabled={!isValid}>
          Siguiente
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
