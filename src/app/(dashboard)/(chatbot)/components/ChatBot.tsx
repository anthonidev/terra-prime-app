import {
  getAvailableGuides,
  getChatSessions,
  getGuideDetail,
  getQuickHelp,
  getRateLimitStatus,
  getSessionHistory,
  sendMessage
} from '../actions';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { ChatMessage, Guide, MessageRequest, RateLimitStatus } from '@/types/chat/chatbot.types';
import {
  AlertTriangle,
  Book,
  Bot,
  HelpCircle,
  History,
  MessageCircle,
  Send,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ChatbotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ActiveSession {
  id: string;
  messages: ChatMessage[];
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onOpenChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickHelp, setQuickHelp] = useState<string[]>([]);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<{ code: string; name: string } | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  const [availableGuides, setAvailableGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<{ title: string; steps: string[] } | null>(
    null
  );
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<
    Array<{ id: string; isActive: boolean; createdAt: string; updatedAt: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chatbot when opened
  useEffect(() => {
    if (isOpen) {
      initializeChatbot();
      // Focus input after a small delay to ensure the sheet is open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const initializeChatbot = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load quick help and rate limit status
      const [quickHelpResponse, rateLimitResponse] = await Promise.all([
        getQuickHelp(),
        getRateLimitStatus()
      ]);

      if (quickHelpResponse.success) {
        setQuickHelp(quickHelpResponse.help);
        setUserRole(quickHelpResponse.userRole);
      }

      if (rateLimitResponse.success) {
        setRateLimitStatus(rateLimitResponse.rateLimitStatus);
      }

      // Load sessions
      const sessionsResponse = await getChatSessions();
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.sessions);

        // Find active session
        const activeSession = sessionsResponse.sessions.find((s) => s.isActive);
        if (activeSession) {
          setCurrentSessionId(activeSession.id);
          await loadSessionHistory(activeSession.id);
        }
      }
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      setError('Error al inicializar el chatbot');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionHistory = async (sessionId: string) => {
    try {
      const historyResponse = await getSessionHistory(sessionId);
      if (historyResponse.success) {
        setMessages(historyResponse.messages);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    // Check rate limit
    if (rateLimitStatus?.isBlocked) {
      setError(
        `Límite alcanzado. Intenta después de ${new Date(rateLimitStatus.resetTime).toLocaleTimeString()}`
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setInputMessage('');

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageToSend,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, userMessage]);

      // Prepare request
      const messageRequest: MessageRequest = {
        message: messageToSend,
        ...(currentSessionId && { sessionId: currentSessionId })
      };

      const response = await sendMessage(messageRequest);

      if (response.success && response.data) {
        // Update session ID if it's a new conversation
        if (!currentSessionId) {
          setCurrentSessionId(response.data.sessionId);
        }

        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.response,
          createdAt: response.data.timestamp
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update rate limit status
        if (response.data.rateLimitInfo) {
          setRateLimitStatus((prev) =>
            prev
              ? {
                  ...prev,
                  current: prev.limit - response.data.rateLimitInfo.remaining,
                  remaining: response.data.rateLimitInfo.remaining
                }
              : null
          );
        }
      } else {
        setError(response.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickHelpClick = (question: string) => {
    handleSendMessage(question);
  };

  const loadGuides = async () => {
    try {
      const guidesResponse = await getAvailableGuides();
      if (guidesResponse.success) {
        setAvailableGuides(guidesResponse.guides);
        setShowGuides(true);
      }
    } catch (error) {
      console.error('Error loading guides:', error);
    }
  };

  const handleGuideClick = async (guideKey: string) => {
    try {
      const guideResponse = await getGuideDetail(guideKey);
      if (guideResponse.success) {
        setSelectedGuide(guideResponse.guide);
      }
    } catch (error) {
      console.error('Error loading guide:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRateLimitWarning = () => {
    if (!rateLimitStatus) return null;

    if (rateLimitStatus.isBlocked) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4" />
          🚫 Límite alcanzado. Intenta después de{' '}
          {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
        </div>
      );
    }

    if (rateLimitStatus.remaining < 10) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          ⚠️ Te quedan {rateLimitStatus.remaining} mensajes
        </div>
      );
    }

    return null;
  };

  const resetView = () => {
    setShowGuides(false);
    setShowHistory(false);
    setSelectedGuide(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[480px]">
        <SheetHeader className="border-b bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <SheetTitle className="text-white">Asistente Virtual</SheetTitle>
                {userRole && (
                  <SheetDescription className="text-blue-100">
                    Rol: {userRole.name}
                  </SheetDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetView();
                  setShowHistory(!showHistory);
                }}
                className="rounded p-1 hover:bg-blue-700"
                title="Historial"
              >
                <History className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  resetView();
                  loadGuides();
                }}
                className="rounded p-1 hover:bg-blue-700"
                title="Guías"
              >
                <Book className="h-4 w-4" />
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Rate limit warning */}
        {getRateLimitWarning() && <div className="border-b px-6 py-3">{getRateLimitWarning()}</div>}

        {/* Error message */}
        {error && (
          <div className="border-b px-6 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col">
          {selectedGuide ? (
            /* Guide view */
            <div className="overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">{selectedGuide.title}</h4>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {selectedGuide.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : showGuides ? (
            /* Guides list */
            <div className="overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Guías Disponibles</h4>
                <button
                  onClick={() => setShowGuides(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {availableGuides.map((guide) => (
                  <button
                    key={guide.key}
                    onClick={() => handleGuideClick(guide.key)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <h5 className="font-medium text-gray-900">{guide.title}</h5>
                    <p className="text-sm text-gray-600">{guide.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : showHistory ? (
            /* Sessions history */
            <div className="overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Historial de Conversaciones</h4>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      loadSessionHistory(session.id);
                      setCurrentSessionId(session.id);
                      setShowHistory(false);
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      session.isActive
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {session.isActive ? 'Sesión Activa' : 'Sesión'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat view */
            <>
              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.length === 0 && quickHelp.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-center text-gray-600">
                      ¡Hola! Soy tu asistente virtual. Puedes preguntarme cualquier cosa o usar
                      estas preguntas rápidas:
                    </p>
                    <div className="space-y-2">
                      {quickHelp.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickHelpClick(question)}
                          className="w-full rounded-lg border border-blue-200 bg-blue-50 p-3 text-left text-blue-800 transition-colors hover:bg-blue-100"
                        >
                          <HelpCircle className="mr-2 inline h-4 w-4" />
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3 rounded-lg bg-gray-100 p-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-6">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isLoading || rateLimitStatus?.isBlocked}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading || rateLimitStatus?.isBlocked}
                    className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {rateLimitStatus && (
                  <div className="mt-2 text-center text-xs text-gray-500">
                    {rateLimitStatus.remaining}/{rateLimitStatus.limit} mensajes disponibles
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Chatbot;
