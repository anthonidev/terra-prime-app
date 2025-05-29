'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

export function Stepper({ steps, currentStepId, className }: StepperProps) {
  console.log('%s', currentStepId);
  return (
    <nav className={cn('', className)}>
      <ol className="flex w-full items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={stepIdx}
            className="flex w-full items-center text-blue-600 after:inline-block after:w-full after:border-2 after:border-b after:border-slate-200 after:content-[''] dark:text-blue-500 dark:after:border-gray-900/50"
          >
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                step.status === 'complete' && 'border border-green-500 bg-green-400',
                step.status === 'current' && 'border-2 border-[#00c07b] bg-white dark:bg-gray-900',
                step.status === 'upcoming' &&
                  'border-2 border-gray-300 bg-gray-100 dark:border-slate-500 dark:bg-gray-900'
              )}
            >
              {step.status === 'complete' ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <span
                  className={cn(
                    step.status === 'current' && 'text-green-600',
                    step.status === 'upcoming' && 'text-gray-500'
                  )}
                >
                  {stepIdx + 1}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
