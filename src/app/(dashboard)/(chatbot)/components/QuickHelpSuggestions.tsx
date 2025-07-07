'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QuickHelpResponse } from '@/types/chat/chatbot.types';
import { MessageSquare, Sparkles } from 'lucide-react';

interface QuickHelpSuggestionsProps {
  quickHelp: QuickHelpResponse;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const QuickHelpSuggestions = ({
  quickHelp,
  onSendMessage,
  isLoading
}: QuickHelpSuggestionsProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6 p-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ¡Hola! ¿En qué puedo ayudarte hoy?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selecciona una de estas opciones o escribe tu propia consulta
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        {quickHelp.help.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer py-0 transition-all hover:shadow-md"
            onClick={() => !isLoading && onSendMessage(item.question)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {item.question}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
