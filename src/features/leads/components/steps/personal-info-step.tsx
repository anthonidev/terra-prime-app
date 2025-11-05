'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone2: string;
  age: string;
  onFieldChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalInfoStep({
  firstName,
  lastName,
  email,
  phone,
  phone2,
  age,
  onFieldChange,
  onNext,
  onBack,
}: PersonalInfoStepProps) {
  const isValid = firstName && lastName && phone;

  return (
    <div className="rounded-lg border bg-card shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Datos Personales</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Nombres <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              placeholder="Ingrese nombres"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Apellidos <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              placeholder="Ingrese apellidos"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="999 999 999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone2">Teléfono 2</Label>
            <Input
              id="phone2"
              type="tel"
              value={phone2}
              onChange={(e) => onFieldChange('phone2', e.target.value)}
              placeholder="999 999 999"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Edad</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => onFieldChange('age', e.target.value)}
            placeholder="Edad"
            min="0"
            max="120"
          />
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
