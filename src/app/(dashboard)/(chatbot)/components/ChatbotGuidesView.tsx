import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Guide } from '@/types/chat/chatbot.types';
import { Book, ChevronRight, FileText, HelpCircle, MessageCircle } from 'lucide-react';

interface ChatbotGuidesViewProps {
  guides: Guide[];
  isLoading: boolean;
  onSelectGuide: (guideKey: string) => void;
  onBackToChat: () => void;
}

export const ChatbotGuidesView = ({
  guides,
  isLoading,
  onSelectGuide,
  onBackToChat
}: ChatbotGuidesViewProps) => {
  const getGuideIcon = (index: number) => {
    const icons = [Book, FileText, HelpCircle, MessageCircle];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="text-primary h-5 w-5" />;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <Book className="text-primary h-6 w-6" />
                </div>
              </div>
              <h2 className="text-foreground mb-2 text-xl font-semibold">Guías de Ayuda</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Consulta estas guías paso a paso para aprender a usar las diferentes funciones del
                sistema.
              </p>
            </div>

            {/* Guides Grid */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : guides.length === 0 ? (
              <Card className="border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                      <FileText className="text-muted-foreground h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    No hay guías disponibles
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center text-sm leading-relaxed">
                    Las guías de ayuda aparecerán aquí cuando estén disponibles para tu rol.
                  </p>
                  <Button onClick={onBackToChat} variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Volver al chat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {guides.map((guide, index) => (
                  <Card
                    key={guide.key}
                    className="group border-border hover:border-primary/30 hover:bg-card-hover cursor-pointer transition-all hover:shadow-sm"
                    onClick={() => onSelectGuide(guide.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="bg-primary/10 group-hover:bg-primary/15 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors">
                          {getGuideIcon(index)}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h3 className="text-card-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold transition-colors">
                              {guide.title}
                            </h3>
                            <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 flex-shrink-0 transition-all group-hover:translate-x-0.5" />
                          </div>

                          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                            {guide.description}
                          </p>

                          {/* Action hint */}
                          <div className="text-primary mt-3 flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                            <span>Ver guía completa</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Help text */}
            {guides.length > 0 && (
              <Card className="border-border bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="text-primary h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="text-foreground mb-1 text-sm font-medium">
                        ¿Necesitas más ayuda?
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        Si no encuentras lo que buscas en estas guías, puedes preguntarme
                        directamente en el chat. Estoy aquí para ayudarte.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
