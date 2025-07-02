export interface QuickHelpResponse {
  success: boolean;
  help: string[];
  userRole: {
    code: string;
    name: string;
  };
}

export interface RateLimitStatus {
  current: number;
  limit: number;
  remaining: number;
  resetTime: string;
  isBlocked: boolean;
}

export interface RateLimitResponse {
  success: boolean;
  rateLimitStatus: RateLimitStatus;
}

export interface MessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  sessionId: string;
  response: string;
  timestamp: string;
  rateLimitInfo: {
    remaining: number;
    resetTime: string;
    isWarning: boolean;
  };
}

export interface SearchContextRequest {
  query: string;
}

export interface SearchContextResponse {
  success: boolean;
  query: string;
  results: {
    relevantCapabilities: string[];
    relevantQueries: string[];
    suggestedGuides: Array<{
      key: string;
      title: string;
    }>;
  };
  userRole: {
    code: string;
    name: string;
  };
}

export interface Guide {
  key: string;
  title: string;
  description: string;
}

export interface AvailableGuidesResponse {
  success: boolean;
  guides: Guide[];
  userRole: {
    code: string;
    name: string;
  };
}

export interface GuideDetailResponse {
  success: boolean;
  guide: {
    title: string;
    steps: string[];
  };
}

export interface ChatSession {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionsResponse {
  success: boolean;
  sessions: ChatSession[];
}

export interface HistoryResponse {
  success: boolean;
  sessionId: string;
  messages: ChatMessage[];
}

export interface ChatbotErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: {
    blockReason?: string;
    resetTime?: string;
    remaining?: number;
  };
}
