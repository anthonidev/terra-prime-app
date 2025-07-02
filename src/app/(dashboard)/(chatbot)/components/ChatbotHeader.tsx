import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Book, Bot, History, Plus, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';

interface ChatbotHeaderProps {
  userRole: { code: string; name: string } | null;
  currentView: 'chat' | 'history' | 'guides' | 'guide-detail';
  onNewChat: () => void;
  onViewHistory: () => void;
  onViewGuides: () => void;
  currentSessionId: string | null;
}

export const ChatbotHeader = ({
  userRole,
  currentView,
  onNewChat,
  onViewHistory,
  onViewGuides,
  currentSessionId
}: ChatbotHeaderProps) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'chat':
        return 'Asistente Virtual';
      case 'history':
        return 'Historial de Conversaciones';
      case 'guides':
        return 'Guías Disponibles';
      case 'guide-detail':
        return 'Guía Detallada';
      default:
        return 'Asistente Virtual';
    }
  };

  const getViewIcon = () => {
    switch (currentView) {
      case 'chat':
        return <Bot className="h-5 w-5" />;
      case 'history':
        return <History className="h-5 w-5" />;
      case 'guides':
      case 'guide-detail':
        return <Book className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  const showBackButton = currentView !== 'chat';

  return (
    <div className="border-border bg-primary text-primary-foreground border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Back button for non-chat views */}
          {showBackButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNewChat}
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Volver al chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            {getViewIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{getViewTitle()}</h1>
              {currentView === 'chat' && (
                <Sparkles className="text-primary-foreground/80 h-4 w-4" />
              )}
            </div>

            {currentView === 'chat' && userRole && (
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-primary-foreground border-white/20 bg-white/20 text-xs"
                >
                  {userRole.name}
                </Badge>
                {currentSessionId && (
                  <Badge
                    variant="outline"
                    className="text-primary-foreground border-white/30 bg-white/10 text-xs"
                  >
                    Sesión activa
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section - Actions (only show for chat view) */}
        {currentView === 'chat' && (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNewChat}
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nuevo chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6 bg-white/20" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewHistory}
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver historial</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewGuides}
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    <Book className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver guías</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};
