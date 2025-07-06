'use client';

import { ChatMessage } from './ChatMessage';
import { QuickHelpSuggestions } from './QuickHelpSuggestions';
import { SessionsList } from './SessionsList';
import { GuidesList } from './GuidesList';
import { GuideDetail } from './GuideDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';

interface ChatContentProps {
  chatbot: ReturnType<typeof useChatbot>;
}

export const ChatContent = ({ chatbot }: ChatContentProps) => {
  const {
    currentView,
    sessions,
    messages,
    isLoading,
    quickHelp,
    availableGuides,
    currentGuide,
    error,
    selectSession,
    handleSendMessage,
    handleDeleteSession,
    loadGuideDetail,
    messagesEndRef
  } = chatbot;

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
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            quickHelp && (
              <QuickHelpSuggestions
                quickHelp={quickHelp}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            )
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
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
    ) : (
      <div className="flex h-full items-center justify-center">
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  // Guide Detail View
  if (currentView === 'guide-detail' && currentGuide) {
    return <GuideDetail guide={currentGuide} />;
  }

  return null;
};
