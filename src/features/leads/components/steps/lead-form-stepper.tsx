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
      <div className="relative flex items-center justify-between">
        {/* Progress Bar Background */}
        <div className="bg-muted absolute top-1/2 left-0 -z-10 h-0.5 w-full -translate-y-1/2" />

        {/* Active Progress Bar */}
        <div
          className="bg-primary absolute top-1/2 left-0 -z-10 h-0.5 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isActive = currentStep >= step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="bg-background flex flex-col items-center gap-2 px-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  'absolute top-10 w-32 text-center text-xs font-medium transition-colors duration-300',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                  // Hide title on mobile for non-active steps to avoid clutter, or just show active
                  'hidden sm:block'
                )}
              >
                {step.title}
              </span>
              {/* Mobile only title for active step */}
              <span
                className={cn(
                  'absolute top-10 w-32 text-center text-xs font-medium sm:hidden',
                  currentStep === step.number ? 'text-foreground block' : 'hidden'
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      {/* Spacer for titles */}
      <div className="h-6" />
    </div>
  );
}
