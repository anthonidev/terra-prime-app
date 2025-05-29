import { useState } from 'react';

type StepStatus = 'complete' | 'current' | 'upcoming';

interface Step {
  id: string;
  status: StepStatus;
}

export function useStepper(steps: Omit<Step, 'status'>[]) {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id || '');

  const getSteps = (): Step[] => {
    return steps.map((step) => ({
      ...step,
      status: getStepStatus(step.id)
    }));
  };

  const getStepStatus = (stepId: string): StepStatus => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId);
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return {
    steps: getSteps(),
    currentStepId,
    setCurrentStepId,
    nextStep: () => {
      const currentIndex = steps.findIndex((step) => step.id === currentStepId);
      if (currentIndex < steps.length - 1) {
        setCurrentStepId(steps[currentIndex + 1].id);
      }
    },
    prevStep: () => {
      const currentIndex = steps.findIndex((step) => step.id === currentStepId);
      if (currentIndex > 0) {
        setCurrentStepId(steps[currentIndex - 1].id);
      }
    },
    goToStep: (stepId: string) => {
      if (steps.some((step) => step.id === stepId)) {
        setCurrentStepId(stepId);
      }
    }
  };
}
