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
import { useEffect } from 'react';

interface ChatbotSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotSheet = ({ isOpen, onOpenChange }: ChatbotSheetProps) => {
  const chatbot = useChatbot();

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

  const handleDeleteAllSessions = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar todas las sesiones?')) {
      for (const session of chatbot.sessions) {
        await chatbot.handleDeleteSession(session.id);
      }
    }
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
            onDeleteAllSessions={handleDeleteAllSessions}
            sessionCount={chatbot.sessions.length}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ChatContent chatbot={chatbot} />
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
