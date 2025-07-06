import { useEffect, useState, useCallback, useRef } from 'react';

interface UseScrollToBottomOptions {
  threshold?: number; // Pixels desde abajo para considerar que está en el bottom
  smoothBehavior?: boolean;
}

interface UseScrollToBottomReturn {
  isAtBottom: boolean;
  showScrollButton: boolean;
  scrollToBottom: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const useScrollToBottom = ({
  threshold = 100,
  smoothBehavior = true
}: UseScrollToBottomOptions = {}): UseScrollToBottomReturn => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Función para verificar si está en el bottom
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Función para hacer scroll al bottom
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: smoothBehavior ? 'smooth' : 'auto',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [smoothBehavior]);

  // Función mejorada con reintentos para scroll automático
  const scrollToBottomWithRetry = useCallback(
    (attempts = 0) => {
      if (attempts >= 3) return;

      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: smoothBehavior ? 'smooth' : 'auto',
          block: 'end',
          inline: 'nearest'
        });
      }

      // Reintenta después de un breve delay
      setTimeout(() => scrollToBottomWithRetry(attempts + 1), 50);
    },
    [smoothBehavior]
  );

  // Listener para el scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = checkIfAtBottom();
      setIsAtBottom(atBottom);

      // Solo mostrar el botón si no está en el bottom y ha scrolleado hacia arriba
      setShowScrollButton(!atBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Check inicial
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [checkIfAtBottom]);

  return {
    isAtBottom,
    showScrollButton,
    scrollToBottom: scrollToBottomWithRetry,
    containerRef,
    bottomRef
  };
};
