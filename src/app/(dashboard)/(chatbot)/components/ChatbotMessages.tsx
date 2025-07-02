import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat/chatbot.types';
import { Bot, HelpCircle, User, ChevronDown } from 'lucide-react';
import { UIEvent, useEffect, useRef, useState } from 'react';

interface ChatbotMessagesProps {
  messages: ChatMessage[];
  quickHelp: string[];
  isLoading: boolean;
  onQuickHelpClick: (question: string) => void;
}

export const ChatbotMessages = ({
  messages,
  quickHelp,
  isLoading,
  onQuickHelpClick
}: ChatbotMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  if (messagesEndRef.current && shouldAutoScroll) {
    messagesEndRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }

  // Detectar si el usuario está haciendo scroll manual
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, shouldAutoScroll]);

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea ref={scrollAreaRef} className="flex-1" onScrollCapture={handleScroll}>
        <div className="space-y-4 px-4 py-4">
          {/* Welcome message and quick help - only show when no messages */}
          {messages.length === 0 && (
            <div className="mx-auto max-w-full space-y-6">
              {/* Welcome card */}
              <Card className="border-border from-card to-muted/50 bg-gradient-to-br">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                      <Bot className="text-primary-foreground h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    ¡Hola! Soy tu asistente virtual
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Puedo ayudarte con información sobre el sistema, responder preguntas y guiarte
                    en diferentes procesos.
                  </p>
                </CardContent>
              </Card>

              {/* Quick help */}
              {quickHelp.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <HelpCircle className="text-muted-foreground h-4 w-4" />
                    <h4 className="text-foreground text-sm font-medium">Preguntas frecuentes</h4>
                  </div>

                  <div className="grid gap-2">
                    {quickHelp.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => onQuickHelpClick(question)}
                        className="group hover:bg-card-hover h-auto justify-start p-3 text-left transition-colors"
                      >
                        <HelpCircle className="text-muted-foreground group-hover:text-foreground mr-3 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-card-foreground text-xs leading-relaxed">
                          {question}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="mx-auto max-w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar for assistant */}
                  {message.role === 'assistant' && (
                    <Avatar className="border-border h-8 w-8 flex-shrink-0 border">
                      <AvatarFallback className="bg-primary">
                        <Bot className="text-primary-foreground h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Message content */}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border-border border'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <p
                        className={`text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === 'user'
                            ? 'text-primary-foreground'
                            : 'text-card-foreground'
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <time
                        className={`text-xs ${
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                  </div>

                  {/* Avatar for user */}
                  {message.role === 'user' && (
                    <Avatar className="border-border h-8 w-8 flex-shrink-0 border">
                      <AvatarFallback className="bg-muted">
                        <User className="text-muted-foreground h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="border-border mr-3 h-8 w-8 flex-shrink-0 border">
                    <AvatarFallback className="bg-primary">
                      <Bot className="text-primary-foreground h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="bg-card border-border rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"></div>
                        <div
                          className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                      <span className="text-muted-foreground text-xs">Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {!shouldAutoScroll && messages.length > 0 && (
        <div className="absolute right-4 bottom-4 z-10">
          <Button
            onClick={() => {
              setShouldAutoScroll(true);
              scrollToBottom();
            }}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9 rounded-full p-0 shadow-lg transition-transform hover:scale-105"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatbotMessages;
