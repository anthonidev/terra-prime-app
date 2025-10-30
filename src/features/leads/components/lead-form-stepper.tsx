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
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                  currentStep > step.number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.number
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-sm font-medium transition-colors',
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 transition-colors',
                  currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
