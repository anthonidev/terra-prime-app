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
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Nombres <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                placeholder="Ingrese nombres"
                className="h-10"
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
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                className="h-10 pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      onFieldChange('phone', value);
                    }
                  }}
                  placeholder="999 999 999"
                  className="h-10 pl-10"
                  maxLength={9}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone2">Teléfono 2 (Opcional)</Label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="phone2"
                  type="tel"
                  value={phone2}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      onFieldChange('phone2', value);
                    }
                  }}
                  placeholder="999 999 999"
                  className="h-10 pl-10"
                  maxLength={9}
                />
              </div>
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
              className="h-10 max-w-[120px]"
            />
          </div>

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
      </CardContent>
    </Card>
  );
}
