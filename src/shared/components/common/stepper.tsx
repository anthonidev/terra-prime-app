'use client';

import { Check, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

export interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile compact version */}
      <div className="md:hidden">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">
              Paso {currentStep} de {steps.length}
            </p>
            <p className="text-xs font-semibold text-primary">
              {steps.find(s => s.id === currentStep)?.label}
            </p>
          </div>
          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          </div>
        </div>

        {/* Compact step indicators */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div
                    className={cn(
                      'relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300',
                      isCompleted &&
                      'border-primary bg-primary text-primary-foreground shadow-sm',
                      isCurrent &&
                      'border-primary bg-background text-primary ring-2 ring-primary/30 shadow-md',
                      isPending &&
                      'border-border bg-muted/20 text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : isCurrent ? (
                      <Circle className="h-3.5 w-3.5 fill-primary" strokeWidth={0} />
                    ) : (
                      <span className="text-[10px] font-bold">{step.id}</span>
                    )}
                  </div>
                </motion.div>

                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-3 rounded-full transition-colors duration-300',
                      isCompleted ? 'bg-primary' : 'bg-border/50'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop version */}
      <nav aria-label="Progress" className="hidden md:block">
        <ol role="list" className="flex items-start justify-between gap-2 lg:gap-4">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <li
                key={step.id}
                className={cn(
                  'flex flex-1 items-start',
                  stepIdx !== steps.length - 1 && 'gap-2'
                )}
              >
                <div className="flex flex-col items-center flex-1 min-w-0">
                  {/* Step indicator and connector */}
                  <div className="flex items-center w-full relative">
                    {/* Step circle/icon */}
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: isCurrent ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 flex-shrink-0"
                    >
                      <div
                        className={cn(
                          'relative flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                          isCompleted &&
                          'border-primary bg-primary text-primary-foreground shadow-md',
                          isCurrent &&
                          'border-primary bg-background text-primary ring-4 ring-primary/20 shadow-lg',
                          isPending &&
                          'border-border bg-muted/30 text-muted-foreground'
                        )}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                          >
                            <Check className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={3} />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                          >
                            <Circle className="h-5 w-5 lg:h-6 lg:w-6 fill-primary" strokeWidth={0} />
                          </motion.div>
                        ) : (
                          <span className="text-sm lg:text-base font-semibold">
                            {step.id}
                          </span>
                        )}

                        {/* Pulse effect for current step */}
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Connector line */}
                    {stepIdx !== steps.length - 1 && (
                      <div className="flex-1 px-2 lg:px-3">
                        <div className="relative h-0.5 w-full bg-border/50 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-accent rounded-full"
                            initial={{ width: '0%' }}
                            animate={{
                              width: isCompleted ? '100%' : '0%',
                            }}
                            transition={{
                              duration: 0.5,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step label and description */}
                  <motion.div
                    className="mt-3 text-center w-full px-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stepIdx * 0.1 }}
                  >
                    <p
                      className={cn(
                        'text-xs lg:text-sm font-semibold transition-colors duration-300 line-clamp-2',
                        isCurrent && 'text-primary',
                        isCompleted && 'text-foreground',
                        isPending && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p
                        className={cn(
                          'text-[10px] lg:text-xs mt-1 transition-colors duration-300 line-clamp-2',
                          isCurrent && 'text-primary/70',
                          isCompleted && 'text-muted-foreground',
                          isPending && 'text-muted-foreground/60'
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </motion.div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
