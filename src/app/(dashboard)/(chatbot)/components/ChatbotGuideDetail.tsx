import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GuideDetailResponse } from '@/types/chat/chatbot.types';
import { ArrowLeft, Book, CheckCircle, MessageCircle } from 'lucide-react';
import React from 'react';

interface ChatbotGuideDetailProps {
  guide: GuideDetailResponse | null;
  onBackToGuides: () => void;
  onBackToChat: () => void;
}

export const ChatbotGuideDetail: React.FC<ChatbotGuideDetailProps> = ({
  guide,
  onBackToGuides,
  onBackToChat
}) => {
  if (!guide) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Book className="text-muted-foreground h-6 w-6" />
            </div>
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">Guía no encontrada</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            No se pudo cargar el contenido de esta guía.
          </p>
          <div className="flex gap-3">
            <Button onClick={onBackToGuides} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a guías
            </Button>
            <Button onClick={onBackToChat} size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Ir al chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <div className="border-border bg-muted/30 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button onClick={onBackToGuides} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Guías
          </Button>
          <div className="bg-border h-4 w-px" />
          <Button onClick={onBackToChat} variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-2xl space-y-6 p-6">
            {/* Header */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                  <Book className="text-primary h-7 w-7" />
                </div>
              </div>
              <h1 className="text-foreground mb-3 text-xl font-bold">{guide.guide.title}</h1>
              <p className="text-muted-foreground text-sm">
                Sigue estos pasos para completar esta tarea correctamente.
              </p>
            </div>

            {/* Progress indicator */}
            <Card className="border-border bg-muted/30 p-1">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <CheckCircle className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-card-foreground text-sm font-medium">Guía paso a paso</h3>
                    <p className="text-muted-foreground text-xs">
                      {guide.guide.steps.length} pasos para completar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <div className="space-y-3">
              {guide.guide.steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="border-border bg-card p-1 transition-all hover:shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {/* Step number */}
                        <div className="bg-primary text-primary-foreground flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                          {index + 1}
                        </div>

                        {/* Step content */}
                        <div className="flex-1">
                          <h3 className="text-card-foreground mb-1 text-sm font-medium">
                            Paso {index + 1}
                          </h3>
                          <p className="text-card-foreground text-sm leading-relaxed">{step}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress line (except for last step) */}
                  {index < guide.guide.steps.length - 1 && (
                    <div className="bg-border mt-1 ml-6 h-3 w-px"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Completion message */}
            <Card className="border-primary/20 bg-primary/5 p-2">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <h4 className="text-primary mb-1 text-sm font-medium">¡Excelente trabajo!</h4>
                    <p className="text-primary/80 text-xs leading-relaxed">
                      Has completado todos los pasos de esta guía. Si tienes alguna duda o necesitas
                      ayuda adicional, no dudes en preguntarme en el chat.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={onBackToGuides} variant="outline" size="sm" className="sm:w-auto">
                <Book className="mr-2 h-4 w-4" />
                Ver más guías
              </Button>
              <Button onClick={onBackToChat} size="sm" className="sm:w-auto">
                <MessageCircle className="mr-2 h-4 w-4" />
                Hacer una pregunta
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
