import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatSession, Guide, GuideDetailResponse } from '@/types/chat/chatbot.types';
import {
  ArrowLeft,
  Book,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  History,
  MessageCircle
} from 'lucide-react';
import React from 'react';

interface ChatbotSidebarProps {
  viewMode: 'chat' | 'history' | 'guides' | 'guide-detail';
  sessions: ChatSession[];
  availableGuides: Guide[];
  selectedGuide: GuideDetailResponse | null;
  onSelectSession: (sessionId: string) => void;
  onSelectGuide: (guideKey: string) => void;
  onBackToChat: () => void;
  isLoading: boolean;
}

export const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
  viewMode,
  sessions,
  availableGuides,
  selectedGuide,
  onSelectSession,
  onSelectGuide,
  onBackToChat,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const renderHistoryView = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="text-primary h-5 w-5" />
          <h3 className="text-foreground font-semibold">Historial</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ))
          ) : sessions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <MessageCircle className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-center text-sm">
                  No hay conversaciones previas
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                onClick={() => onSelectSession(session.id)}
                className="bg-card hover:bg-card-hover border-border h-auto w-full justify-start rounded-lg border p-3"
              >
                <div className="flex w-full items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Circle
                      className={`h-2 w-2 ${
                        session.isActive ? 'fill-green-500 text-green-500' : 'text-muted-foreground'
                      }`}
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-card-foreground text-sm font-medium">
                        {session.isActive ? 'Sesión Activa' : 'Conversación'}
                      </span>
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(session.updatedAt)}</span>
                      {session.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Activa
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderGuidesView = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="text-primary h-5 w-5" />
          <h3 className="text-foreground font-semibold">Guías</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))
          ) : availableGuides.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <FileText className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-center text-sm">
                  No hay guías disponibles
                </p>
              </CardContent>
            </Card>
          ) : (
            availableGuides.map((guide) => (
              <Card
                key={guide.key}
                className="hover:bg-card-hover border-border cursor-pointer border transition-colors"
                onClick={() => onSelectGuide(guide.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-card-foreground mb-1 line-clamp-2 font-medium">
                        {guide.title}
                      </h4>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {guide.description}
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="bg-muted/30 border-border h-full overflow-hidden border-r">
      {viewMode === 'history' && renderHistoryView()}
      {viewMode === 'guides' && renderGuidesView()}
    </div>
  );
};
