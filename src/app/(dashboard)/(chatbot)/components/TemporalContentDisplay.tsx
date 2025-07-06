'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemporalContent } from '../hooks/useChatbot';
import {
  QuickHelpResponse,
  AvailableGuidesResponse,
  GuideDetailResponse
} from '@/types/chat/chatbot.types';
import {
  HelpCircle,
  BookOpen,
  X,
  CheckCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  Zap,
  FileText
} from 'lucide-react';

interface TemporalContentDisplayProps {
  content: TemporalContent;
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  onShowGuideDetail?: (guideKey: string) => void;
}

export const TemporalContentDisplay = ({
  content,
  onClose,
  onSendMessage,
  onShowGuideDetail
}: TemporalContentDisplayProps) => {
  // Procesar pasos para guías
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
      } else if ((step.trim().startsWith('•') || step.trim().startsWith('   •')) && currentStep) {
        currentStep.details.push(step.trim());
      }
    });

    if (currentStep) {
      processedSteps.push(currentStep);
    }

    return processedSteps;
  };

  const renderQuickHelpList = (data: QuickHelpResponse) => (
    <div className="mx-4 mb-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <Zap className="text-primary h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Preguntas Frecuentes</CardTitle>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>Vista temporal</span>
                  <span>•</span>
                  <span>{data.help.length} preguntas</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {data.help.map((helpItem, index) => (
              <Card
                key={helpItem.id}
                className="hover:bg-muted/50 border-border/50 cursor-pointer py-0 transition-colors"
                onClick={() => onSendMessage?.(helpItem.question)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-sm">{helpItem.question}</p>
                    <MessageSquare className="text-muted-foreground h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="border-t pt-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>Haz clic en cualquier pregunta para enviarla</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGuidesList = (data: AvailableGuidesResponse) => (
    <div className="mx-4 mb-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <BookOpen className="text-primary h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Guías de Ayuda</CardTitle>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>Vista temporal</span>
                  <span>•</span>
                  <span>{data.guides.length} guías</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {data.guides.map((guide, index) => (
              <Card
                key={guide.guideKey}
                className="hover:bg-muted/50 border-border/50 cursor-pointer py-0 transition-colors"
                onClick={() => onShowGuideDetail?.(guide.guideKey)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-sm font-medium">{guide.title}</h4>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {guide.description}
                      </p>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-0.5 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="border-t pt-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <FileText className="h-3 w-3" />
                <span>Haz clic en cualquier guía para ver los detalles</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGuideDetail = (data: GuideDetailResponse) => {
    const processedSteps = processSteps(data.guide.steps);

    return (
      <div className="mx-4 mb-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <BookOpen className="text-primary h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{data.guide.title}</CardTitle>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>Vista temporal</span>
                    <span>•</span>
                    <span>{processedSteps.length} pasos</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {data.guide.description}
              </p>

              <div className="space-y-3">
                {processedSteps.map((stepData, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                        {index + 1}
                      </div>
                      {index < processedSteps.length - 1 && (
                        <div className="bg-border absolute top-6 left-1/2 h-3 w-0.5 -translate-x-1/2 transform" />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <p className="mb-1 text-sm leading-relaxed font-medium">{stepData.step}</p>

                      {stepData.details.length > 0 && (
                        <div className="space-y-0.5 pl-3">
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
                ))}
              </div>

              <div className="border-t pt-2">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Guía temporal - No se guarda en historial
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  switch (content.type) {
    case 'quick-help-list':
      return renderQuickHelpList(content.data);
    case 'guide-list':
      return renderGuidesList(content.data);
    case 'guide-detail':
      return renderGuideDetail(content.data);
    default:
      return null;
  }
};
