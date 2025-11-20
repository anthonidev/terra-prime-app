'use client';

import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: 'Verificación' },
  { number: 2, title: 'Datos Personales' },
  { number: 3, title: 'Información Adicional' },
  { number: 4, title: 'Resumen' },
];

interface LeadFormStepperProps {
  currentStep: number;
}

export function LeadFormStepper({ currentStep }: LeadFormStepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                  currentStep > step.number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.number
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs font-medium transition-colors',
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors',
                  currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
