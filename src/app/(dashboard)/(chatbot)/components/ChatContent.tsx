'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChatbot } from '../hooks/useChatbot';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import { ChatMessage } from './ChatMessage';
import { GuideDetail } from './GuideDetail';
import { GuidesList } from './GuidesList';
import { QuickHelpSuggestions } from './QuickHelpSuggestions';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { SessionsList } from './SessionsList';
import { TemporalContentDisplay } from './TemporalContentDisplay';

interface ChatContentProps {
  chatbot: ReturnType<typeof useChatbot>;
  onViewChange: (view: 'chat' | 'sessions' | 'guides' | 'guide-detail') => void;
  isSheetOpen?: boolean;
}

export const ChatContent = ({ chatbot, isSheetOpen = false, onViewChange }: ChatContentProps) => {
  const {
    currentView,
    sessions,
    messages,
    isLoading,
    isSendingMessage,
    quickHelp,
    availableGuides,
    currentGuide,
    error,
    selectSession,
    handleSendMessage,
    handleDeleteSession,
    loadGuideDetail
  } = chatbot;

  // Hook para manejar el scroll
  const { showScrollButton, scrollToBottom, containerRef, bottomRef } = useScrollToBottom({
    threshold: 100,
    smoothBehavior: true
  });

  // Estado para contar mensajes nuevos cuando no está en el bottom
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Registrar la función de scroll en el hook de chatbot para acceso externo
  useEffect(() => {
    if (chatbot.registerScrollFunction) {
      chatbot.registerScrollFunction(scrollToBottom);
    }
  }, [scrollToBottom, chatbot.registerScrollFunction]);

  // Hacer scroll automático cuando se abre el sheet y hay mensajes
  useEffect(() => {
    if (isSheetOpen && messages.length > 0 && currentView === 'chat') {
      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, scrollToBottom, messages.length, currentView]);

  // Efecto para contar mensajes nuevos
  useEffect(() => {
    if (messages.length > lastMessageCount && !showScrollButton) {
      // Si está en el bottom, resetear contador
      setNewMessagesCount(0);
    } else if (messages.length > lastMessageCount && showScrollButton) {
      // Si no está en el bottom y hay mensajes nuevos, incrementar contador
      setNewMessagesCount((prev) => prev + (messages.length - lastMessageCount));
    }

    setLastMessageCount(messages.length);
  }, [messages.length, showScrollButton, lastMessageCount]);

  // Reset contador cuando hace scroll to bottom
  const handleScrollToBottom = () => {
    scrollToBottom();
    setNewMessagesCount(0);
  };

  // Error Display
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading State
  if (isLoading && currentView === 'chat' && messages.length === 0) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Chat View
  if (currentView === 'chat') {
    return (
      <div className="relative flex h-full flex-col">
        {/* Contenedor de mensajes con scroll mejorado */}
        <div
          ref={containerRef}
          className="overscroll-behavior-contain scroll-container chat-scrollbar flex-1 overflow-y-auto"
        >
          {/* Contenido del chat */}
          <div className="space-y-4 p-4 pb-6">
            {messages.length === 0 ? (
              quickHelp && (
                <QuickHelpSuggestions
                  quickHelp={quickHelp}
                  onSendMessage={handleSendMessage}
                  isLoading={isSendingMessage}
                />
              )
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {/* Indicador de carga cuando está enviando */}
                {isSendingMessage && (
                  <div className="animate-fade-in flex justify-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400" />
                      </div>
                    </div>
                    <div className="max-w-[75%] space-y-2">
                      <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>Escribiendo</span>
                          <div className="typing-dots">
                            <div />
                            <div />
                            <div />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {chatbot.temporalContent && (
              <TemporalContentDisplay
                content={chatbot.temporalContent}
                onClose={chatbot.clearTemporalContent}
                onSendMessage={chatbot.handleSendMessage}
                onShowGuideDetail={chatbot.showGuideDetail}
              />
            )}
            {/* Elemento invisible para scroll automático */}
            <div ref={bottomRef} className="h-1 w-full" style={{ scrollMarginBottom: '1rem' }} />
          </div>
        </div>

        {/* Botón de scroll to bottom */}
        <ScrollToBottomButton
          show={showScrollButton}
          onClick={handleScrollToBottom}
          newMessagesCount={newMessagesCount}
          className="absolute right-4 bottom-20" // Ajustado para no chocar con el input
        />
      </div>
    );
  }

  // Sessions View
  if (currentView === 'sessions') {
    return (
      <SessionsList
        sessions={sessions}
        onSelectSession={selectSession}
        onDeleteSession={handleDeleteSession}
        isLoading={isLoading}
      />
    );
  }

  // Guides View
  if (currentView === 'guides') {
    return availableGuides ? (
      <GuidesList guides={availableGuides} onSelectGuide={loadGuideDetail} isLoading={isLoading} />
    ) : null;
  }

  // Guide Detail View
  if (currentView === 'guide-detail' && currentGuide) {
    return (
      <GuideDetail
        guide={currentGuide}
        isLoading={isLoading}
        onBackToGuides={() => onViewChange('guides')}
      />
    );
  }

  return null;
};
