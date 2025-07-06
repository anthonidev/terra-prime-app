'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { VisuallyHidden } from './VisuallyHidden';
import { ChatHeader } from './ChatHeader';
import { ChatContent } from './ChatContent';
import { MessageInput } from './MessageInput';
import { useChatbot } from '../hooks/useChatbot';
import { useEffect, useRef } from 'react';

interface ChatbotSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotSheet = ({ isOpen, onOpenChange }: ChatbotSheetProps) => {
  const chatbot = useChatbot();
  const previousIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !chatbot.sessions.length && !chatbot.isLoading) {
      chatbot.initializeChatbot();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatbot.error) {
      const timer = setTimeout(() => {
        chatbot.clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [chatbot.error]);

  // Detectar cuando se abre el sheet y hay mensajes existentes
  useEffect(() => {
    const wasClosedNowOpen = !previousIsOpenRef.current && isOpen;

    if (wasClosedNowOpen && chatbot.messages.length > 0 && chatbot.currentView === 'chat') {
      // Usar requestAnimationFrame para asegurar que el DOM esté renderizado
      requestAnimationFrame(() => {
        // Pequeño delay adicional para asegurar que el sheet esté completamente abierto
        setTimeout(() => {
          // Llamar a la función de scroll que está disponible en el contexto
          chatbot.triggerScrollToBottom?.();
        }, 150);
      });
    }

    previousIsOpenRef.current = isOpen;
  }, [isOpen, chatbot.messages.length, chatbot.currentView, chatbot.triggerScrollToBottom]);

  // Función para cerrar el chat (reemplaza al "cerrar todas las sesiones")
  const handleCloseChat = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col p-0 sm:w-[500px] sm:max-w-[500px] lg:w-[600px] lg:max-w-[600px] [&>button:first-of-type]:hidden"
      >
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Asistente Virtual - Chatbot</SheetTitle>
            <SheetDescription>
              Interfaz de chat para interactuar con el asistente virtual del sistema
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex-shrink-0">
          <ChatHeader
            currentView={chatbot.currentView}
            onViewChange={chatbot.setCurrentView}
            onNewChat={chatbot.createNewChat}
            onCloseChat={handleCloseChat}
            sessionCount={chatbot.sessions.length}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ChatContent chatbot={chatbot} isSheetOpen={isOpen} />
        </div>

        {/* Message Input - Solo mostrar en vista de chat */}
        {chatbot.currentView === 'chat' && (
          <div className="flex-shrink-0">
            <MessageInput
              onSendMessage={chatbot.handleSendMessage}
              isLoading={chatbot.isSendingMessage}
              rateLimitStatus={chatbot.rateLimitStatus}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
