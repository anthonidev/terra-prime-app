'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuideDetailResponse } from '@/types/chat/chatbot.types';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';

interface GuideDetailProps {
  guide: GuideDetailResponse;
  isLoading: boolean;
  onBackToGuides?: () => void;
}

export const GuideDetail = ({ guide, isLoading, onBackToGuides }: GuideDetailProps) => {
  const processSteps = (steps: string[]) => {
    const processedSteps: Array<{ step: string; details: string[] }> = [];
    let currentStep: { step: string; details: string[] } | null = null;

    steps.forEach((step) => {
      const isMainStep = /^[\u{1F000}-\u{1F9FF}]/u.test(step);

      if (isMainStep) {
        if (currentStep) {
          processedSteps.push(currentStep);
        }
        currentStep = { step, details: [] };
      } else if (step.trim().startsWith('•') && currentStep) {
        currentStep.details.push(step.trim());
      } else if (step.trim().startsWith('   •') && currentStep) {
        currentStep.details.push(step.trim());
      }
    });

    if (currentStep) {
      processedSteps.push(currentStep);
    }

    return processedSteps;
  };

  const processedSteps = processSteps(guide.guide.steps);

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-4">
        {/* Header de la guía */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="bg-primary/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl">
                <BookOpen className="text-primary h-8 w-8" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-foreground mb-0.5 line-clamp-2 text-lg font-semibold">
                  {guide.guide.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {guide.guide.description}
                </p>
              </div>
            </div>

            {onBackToGuides && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToGuides}
                className="flex flex-shrink-0 items-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Todas las guías</span>
              </Button>
            )}
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                <CheckCircle className="text-primary h-4 w-4" />
              </div>
              Pasos a seguir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {processedSteps.map((stepData, index) => (
                <div key={index} className="group flex gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="bg-primary text-primary-foreground relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-sm">
                      {index + 1}
                    </div>
                    {index < processedSteps.length - 1 && (
                      <div
                        className="bg-border absolute top-8 left-1/2 z-0 w-0.5 -translate-x-1/2 transform"
                        style={{ height: 'calc(100% + 1.5rem)' }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="bg-muted/30 group-hover:bg-muted/50 space-y-3 rounded-lg p-4 transition-colors">
                      <p className="text-foreground text-sm leading-relaxed font-medium">
                        {stepData.step}
                      </p>

                      {stepData.details.length > 0 && (
                        <div className="space-y-1 pl-4">
                          {stepData.details.map((detail, detailIndex) => (
                            <p
                              key={detailIndex}
                              className="text-muted-foreground text-sm leading-relaxed"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer con acciones */}
        {/* <div className="border-border/50 border-t pt-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="text-xs">
                Guía completada
              </Badge>
              <span>¿Te fue útil esta información?</span>
            </div>

            {onBackToGuides && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToGuides}
                className="sm:hidden"
                disabled={isLoading}
              >
                <List className="mr-2 h-4 w-4" />
                Ver todas las guías
              </Button>
            )}
          </div>
        </div> */}
      </div>

      <div className="h-4" />
    </div>
  );
};
