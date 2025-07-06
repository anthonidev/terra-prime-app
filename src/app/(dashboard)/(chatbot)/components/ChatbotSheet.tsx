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

  // Limpiar contenido temporal cuando cambia la vista
  useEffect(() => {
    if (chatbot.currentView !== 'chat') {
      chatbot.clearTemporalContent();
    }
  }, [chatbot.currentView]);

  // Detectar cuando se abre el sheet y hay mensajes existentes
  useEffect(() => {
    const wasClosedNowOpen = !previousIsOpenRef.current && isOpen;

    if (wasClosedNowOpen && chatbot.messages.length > 0 && chatbot.currentView === 'chat') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          chatbot.triggerScrollToBottom?.();
        }, 150);
      });
    }

    previousIsOpenRef.current = isOpen;
  }, [isOpen, chatbot.messages.length, chatbot.currentView, chatbot.triggerScrollToBottom]);

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
            <SheetTitle>SmartBot - Asistente Virtual</SheetTitle>
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
          <ChatContent
            chatbot={chatbot}
            isSheetOpen={isOpen}
            onViewChange={chatbot.setCurrentView}
          />
        </div>

        {/* Message Input - Solo mostrar en vista de chat */}
        {chatbot.currentView === 'chat' && (
          <div className="flex-shrink-0">
            <MessageInput
              onSendMessage={chatbot.handleSendMessage}
              onShowQuickHelpList={chatbot.showQuickHelpList}
              onShowGuidesList={chatbot.showGuidesList}
              isLoading={chatbot.isSendingMessage}
              rateLimitStatus={chatbot.rateLimitStatus}
              hasQuickHelp={!!chatbot.quickHelp?.help?.length}
              hasGuides={!!chatbot.availableGuides?.guides?.length}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
