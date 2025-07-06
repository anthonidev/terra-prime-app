'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChatSession } from '@/types/chat/chatbot.types';
import { MessageSquare, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface SessionsListProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading: boolean;
}

export const SessionsList = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  isLoading
}: SessionsListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          No hay sesiones
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Inicia una nueva conversación para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-3 overflow-y-auto p-4">
      {sessions.map((session) => (
        <Card key={session.id} className="transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 cursor-pointer" onClick={() => onSelectSession(session.id)}>
                <h4 className="mb-1 line-clamp-2 font-medium text-gray-900 dark:text-gray-100">
                  {session.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(session.updatedAt), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                disabled={isLoading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
