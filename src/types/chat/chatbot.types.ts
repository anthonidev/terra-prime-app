export interface QuickHelpResponse {
  success: boolean;
  help: {
    id: string;
    question: string;
  }[];
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
  warningThreshold: number;
  isNearLimit: boolean;
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
  createdAt: string; // like 2025-07-06T03:06:44.464Z
  metadata?: {
    userId?: string;
    queryType?: string; // e.g., 'database', 'system'
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  sessionId: string;
  response: string;
  timestamp: string;
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
  guideKey: string;
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
    guideKey: string;
    title: string;
    steps: string[];
    description: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
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
  title: string;
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
