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
          <Book className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">Guía no encontrada</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            No se pudo cargar el contenido de esta guía.
          </p>
          <div className="flex gap-2">
            <Button onClick={onBackToGuides} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a guías
            </Button>
            <Button onClick={onBackToChat}>
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
      <div className="border-border bg-muted/30 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBackToGuides} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a guías
          </Button>
          <div className="bg-border h-4 w-px" />
          <Button onClick={onBackToChat} variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Ir al chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl space-y-6 p-6">
            {/* Header */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <Book className="text-primary h-8 w-8" />
                </div>
              </div>
              <h1 className="text-foreground mb-3 text-2xl font-bold">{guide.guide.title}</h1>
              <p className="text-muted-foreground">
                Sigue estos pasos para completar esta tarea de manera exitosa.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="border-border bg-muted/30 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <CheckCircle className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Guía paso a paso</h3>
                  <p className="text-muted-foreground text-sm">
                    {guide.guide.steps.length} pasos para completar
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {guide.guide.steps.map((step, index) => (
                <Card key={index} className="border-border bg-card transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Step number */}
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold">
                        {index + 1}
                      </div>

                      {/* Step content */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-card-foreground font-medium">Paso {index + 1}</h3>
                        </div>
                        <p className="text-card-foreground leading-relaxed">{step}</p>
                      </div>
                    </div>

                    {/* Progress line (except for last step) */}
                    {index < guide.guide.steps.length - 1 && (
                      <div className="bg-border mt-4 ml-4 h-6 w-px"></div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Completion message */}
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="mb-1 font-medium text-green-800 dark:text-green-200">
                      ¡Excelente trabajo!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Has completado todos los pasos de esta guía. Si tienes alguna duda o necesitas
                      ayuda adicional, no dudes en preguntarme en el chat.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={onBackToGuides} variant="outline" className="sm:w-auto">
                <Book className="mr-2 h-4 w-4" />
                Ver más guías
              </Button>
              <Button onClick={onBackToChat} className="sm:w-auto">
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
