import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

import { VisuallyHidden } from './VisuallyHidden';

interface ChatbotSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatbotSheet = ({ isOpen, onOpenChange }: ChatbotSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col p-0 sm:w-[500px] sm:max-w-[500px] lg:w-[600px] lg:max-w-[600px] [&>button:first-of-type]:hidden"
      >
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Asistente Virtual - Chatbot</SheetTitle>
            <SheetDescription>
              Interfaz de chat para interactuar con el asistente virtual del sistema
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex-shrink-0">
          <div>Aqui debe ir el header del chat</div>
        </div>

        {/* Error Display */}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">Aqu debe ir el contenido principal del chat</div>
      </SheetContent>
    </Sheet>
  );
};
