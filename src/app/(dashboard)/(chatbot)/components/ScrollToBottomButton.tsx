'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToBottomButtonProps {
  show: boolean;
  onClick: () => void;
  newMessagesCount?: number;
  className?: string;
}

export const ScrollToBottomButton = ({
  show,
  onClick,
  newMessagesCount = 0,
  className
}: ScrollToBottomButtonProps) => {
  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-50 transition-all duration-300 ease-out',
        show
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-2 scale-95 opacity-0',
        className
      )}
    >
      <Button
        onClick={onClick}
        size="sm"
        className={cn(
          'h-12 w-12 rounded-full shadow-lg hover:shadow-xl',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'border-2 border-white/20',
          'backdrop-blur-sm',
          'transition-all duration-200 ease-in-out',
          'hover:scale-110 active:scale-95',
          'group relative overflow-hidden'
        )}
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

        {/* Contenido del botón */}
        <div className="relative flex items-center justify-center">
          {newMessagesCount > 0 ? (
            <div className="flex flex-col items-center">
              <MessageSquare className="mb-0.5 h-4 w-4" />
              <span className="text-xs leading-none font-medium">
                {newMessagesCount > 99 ? '99+' : newMessagesCount}
              </span>
            </div>
          ) : (
            <ArrowDown className="h-5 w-5" />
          )}
        </div>

        {/* Badge de notificación */}
        {newMessagesCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          </div>
        )}
      </Button>
    </div>
  );
};
