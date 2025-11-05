'use client';

import { ArrowLeft, ArrowRight, Mail, Phone, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-medium">
                Nombres <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                placeholder="Ingrese nombres"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-medium">
                Apellidos <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                placeholder="Ingrese apellidos"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium">
                Teléfono <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                  placeholder="999 999 999"
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone2" className="text-xs font-medium">
                Teléfono 2
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone2"
                  type="tel"
                  value={phone2}
                  onChange={(e) => onFieldChange('phone2', e.target.value)}
                  placeholder="999 999 999"
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs font-medium">
              Edad
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => onFieldChange('age', e.target.value)}
              placeholder="Edad"
              min="0"
              max="120"
              className="h-9 text-sm"
            />
          </div>

          <div className="flex justify-between pt-2">
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
      </CardContent>
    </Card>
  );
}
