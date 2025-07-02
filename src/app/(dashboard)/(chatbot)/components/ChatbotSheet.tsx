import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import { useChatbot } from '../hooks/useChatbot';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInput } from './ChatbotInput';
import { ChatbotMessages } from './ChatbotMessages';
import { ChatbotSidebar } from './ChatbotSidebar';
import { RateLimitWarning } from './RateLimitWarning';
import { VisuallyHidden } from './VisuallyHidden';

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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
    setSidebarOpen(false);
  };

  const handleSendMessage = async (message: string) => {
    await sendChatMessage(message);
  };

  const handleViewHistory = () => {
    setViewMode('history');
    setSidebarOpen(true);
  };

  const handleViewGuides = async () => {
    await loadGuides();
    setViewMode('guides');
    setSidebarOpen(true);
  };

  const handleSelectSession = async (sessionId: string) => {
    await loadSessionHistory(sessionId);
    setViewMode('chat');
    setSidebarOpen(false);
  };

  const handleSelectGuide = async (guideKey: string) => {
    await loadGuideDetail(guideKey);
    setViewMode('guide-detail');
  };

  const handleBackToChat = () => {
    setViewMode('chat');
    setSidebarOpen(false);
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
        <ChatbotHeader
          userRole={userRole}
          onNewChat={handleNewChat}
          onViewHistory={handleViewHistory}
          onViewGuides={handleViewGuides}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          currentSessionId={currentSessionId}
        />

        {/* Rate Limit Warning */}
        {(shouldShowWarning || isRateLimited) && (
          <div className="border-b px-6 py-3">
            <RateLimitWarning rateLimitStatus={rateLimitStatus} message={getRateLimitMessage()} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border-b px-6 py-3">
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
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Sidebar */}
          {sidebarOpen && (
            <>
              <div className="border-border w-72 flex-shrink-0 overflow-hidden border-r">
                <ChatbotSidebar
                  viewMode={viewMode}
                  sessions={sessions}
                  availableGuides={availableGuides}
                  selectedGuide={selectedGuide}
                  onSelectSession={handleSelectSession}
                  onSelectGuide={handleSelectGuide}
                  onBackToChat={handleBackToChat}
                  isLoading={isLoading}
                />
              </div>
              <Separator orientation="vertical" />
            </>
          )}

          {/* Chat Area */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {viewMode === 'chat' ? (
              <>
                {/* Messages */}
                <div className="min-h-0 flex-1">
                  <ChatbotMessages
                    messages={messages}
                    quickHelp={quickHelp}
                    isLoading={isLoading}
                    onQuickHelpClick={handleSendMessage}
                  />
                </div>

                {/* Input */}
                <div className="border-border border-t">
                  <ChatbotInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading || isRateLimited}
                    rateLimitStatus={rateLimitStatus}
                  />
                </div>
              </>
            ) : viewMode === 'guide-detail' && selectedGuide ? (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-2xl">
                  <div className="mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('guides')}
                      className="mb-4"
                    >
                      ← Volver a guías
                    </Button>
                    <h2 className="text-foreground mb-2 text-2xl font-bold">
                      {selectedGuide.guide.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {selectedGuide.guide.steps.map((step, index) => (
                      <div
                        key={index}
                        className="border-border bg-card flex gap-4 rounded-lg border p-4"
                      >
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-card-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                  <MessageCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">
                    {viewMode === 'history' && 'Selecciona una conversación del historial'}
                    {viewMode === 'guides' && 'Selecciona una guía para ver los detalles'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
