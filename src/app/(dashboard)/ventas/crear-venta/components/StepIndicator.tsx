'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  stepValidation: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
}

export default function StepIndicator({ steps, currentStep, onStepClick, stepValidation }: Props) {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepClickable = (stepId: number) => {
    return (
      stepId < currentStep ||
      (stepId === currentStep + 1 &&
        stepValidation[`step${currentStep}` as keyof typeof stepValidation])
    );
  };

  const isStepValid = (stepId: number) => {
    return stepValidation[`step${stepId}` as keyof typeof stepValidation];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isValid = isStepValid(step.id);
            const clickable = isStepClickable(step.id);
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex aspect-video h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
                    {
                      'border-green-500 bg-green-500 text-white': status === 'completed' && isValid,
                      'border-blue-500 bg-blue-500 text-white': status === 'current',
                      'border-red-500 bg-red-50 text-red-500': status === 'current' && !isValid,
                      'border-gray-300 bg-white text-gray-400': status === 'upcoming',
                      'hover:border-blue-400': clickable,
                      'cursor-not-allowed opacity-60': !clickable
                    }
                  )}
                  onClick={() => clickable && onStepClick(step.id)}
                >
                  {status === 'completed' && isValid ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <h3
                    className={cn('text-sm font-medium', {
                      'text-green-700': status === 'completed' && isValid,
                      'text-blue-700': status === 'current',
                      'text-red-700': status === 'current' && !isValid,
                      'text-gray-500': status === 'upcoming'
                    })}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="mx-4 hidden sm:block">
                    <div
                      className={cn('h-px w-20 transition-all', {
                        'bg-green-300': step.id < currentStep && isValid,
                        'bg-blue-300': step.id === currentStep,
                        'bg-gray-200': step.id >= currentStep
                      })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 block sm:hidden">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900">
              Paso {currentStep}: {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-xs text-gray-500">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
