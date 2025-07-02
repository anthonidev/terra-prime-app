import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import React from 'react';
import { useChatbot } from '../hooks/useChatbot';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInput } from './ChatbotInput';
import { ChatbotMessages } from './ChatbotMessages';

import { RateLimitWarning } from './RateLimitWarning';
import { VisuallyHidden } from './VisuallyHidden';
import { ChatbotGuidesView } from './ChatbotGuidesView';
import { ChatbotGuideDetail } from './ChatbotGuideDetail';
import { ChatbotHistoryView } from './ChatbotHistoryView';

interface ChatbotSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = 'chat' | 'history' | 'guides' | 'guide-detail';

export const ChatbotSheet: React.FC<ChatbotSheetProps> = ({ isOpen, onOpenChange }) => {
  const {
    messages,
    isLoading,
    error,
    currentSessionId,
    rateLimitStatus,
    quickHelp,
    userRole,
    availableGuides,
    selectedGuide,
    sessions,
    initializeChatbot,
    sendChatMessage,
    loadSessionHistory,
    loadGuides,
    loadGuideDetail,
    closeCurrentSession,
    clearError,
    resetChatbot,
    isRateLimited,
    shouldShowWarning,
    getRateLimitMessage
  } = useChatbot();

  const [viewMode, setViewMode] = React.useState<ViewMode>('chat');

  // Initialize when opened
  React.useEffect(() => {
    if (isOpen) {
      initializeChatbot();
    }
  }, [isOpen, initializeChatbot]);

  const handleNewChat = async () => {
    await closeCurrentSession();
    resetChatbot();
    setViewMode('chat');
  };

  const handleSendMessage = async (message: string) => {
    await sendChatMessage(message);
  };

  const handleViewHistory = () => {
    setViewMode('history');
  };

  const handleViewGuides = async () => {
    await loadGuides();
    setViewMode('guides');
  };

  const handleSelectSession = async (sessionId: string) => {
    await loadSessionHistory(sessionId);
    setViewMode('chat');
  };

  const handleSelectGuide = async (guideKey: string) => {
    await loadGuideDetail(guideKey);
    setViewMode('guide-detail');
  };

  const handleBackToChat = () => {
    setViewMode('chat');
  };

  const handleBackToGuides = () => {
    setViewMode('guides');
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'chat':
        return (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-auto">
              <ChatbotMessages
                messages={messages}
                quickHelp={quickHelp}
                isLoading={isLoading}
                onQuickHelpClick={handleSendMessage}
              />
            </div>

            {/* Input Container */}
            <div className="border-border flex-shrink-0 border-t">
              <ChatbotInput
                onSendMessage={handleSendMessage}
                disabled={isLoading || isRateLimited}
                rateLimitStatus={rateLimitStatus}
              />
            </div>
          </div>
        );

      case 'history':
        return (
          <ChatbotHistoryView
            sessions={sessions}
            isLoading={isLoading}
            onSelectSession={handleSelectSession}
            onBackToChat={handleBackToChat}
          />
        );

      case 'guides':
        return (
          <ChatbotGuidesView
            guides={availableGuides}
            isLoading={isLoading}
            onSelectGuide={handleSelectGuide}
            onBackToChat={handleBackToChat}
          />
        );

      case 'guide-detail':
        return (
          <ChatbotGuideDetail
            guide={selectedGuide}
            onBackToGuides={handleBackToGuides}
            onBackToChat={handleBackToChat}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col p-0 sm:w-[500px] sm:max-w-[500px] lg:w-[600px] lg:max-w-[600px]"
      >
        {/* Hidden title for accessibility */}
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
          <ChatbotHeader
            userRole={userRole}
            currentView={viewMode}
            onNewChat={handleNewChat}
            onViewHistory={handleViewHistory}
            onViewGuides={handleViewGuides}
            currentSessionId={currentSessionId}
          />
        </div>

        {/* Rate Limit Warning */}
        {(shouldShowWarning || isRateLimited) && (
          <div className="border-border flex-shrink-0 border-b px-6 py-3">
            <RateLimitWarning rateLimitStatus={rateLimitStatus} message={getRateLimitMessage()} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border-border flex-shrink-0 border-b px-6 py-3">
            <div className="border-destructive/20 bg-destructive/10 flex items-center justify-between rounded-lg border p-3">
              <span className="text-destructive text-sm">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-destructive hover:text-destructive h-auto p-1"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">{renderCurrentView()}</div>
      </SheetContent>
    </Sheet>
  );
};
