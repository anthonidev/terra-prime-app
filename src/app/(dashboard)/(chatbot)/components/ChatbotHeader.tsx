import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Book, Bot, History, PanelRight, PanelRightClose, Plus, Sparkles } from 'lucide-react';

interface ChatbotHeaderProps {
  userRole: { code: string; name: string } | null;
  onNewChat: () => void;
  onViewHistory: () => void;
  onViewGuides: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  currentSessionId: string | null;
}

export const ChatbotHeader = ({
  userRole,
  onNewChat,
  onViewHistory,
  onViewGuides,
  onToggleSidebar,
  sidebarOpen,
  currentSessionId
}: ChatbotHeaderProps) => {
  return (
    <div className="border-border bg-primary text-primary-foreground border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Asistente Virtual</h1>
              <Sparkles className="text-primary-foreground/80 h-4 w-4" />
            </div>

            {userRole && (
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

        {/* Right section - Actions */}
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
                <p>Historial</p>
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
                <p>Guías</p>
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
                  onClick={onToggleSidebar}
                  className="text-primary-foreground hover:bg-white/10"
                >
                  {sidebarOpen ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRight className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sidebarOpen ? 'Cerrar panel' : 'Abrir panel'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
