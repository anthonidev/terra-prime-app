import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { NavigationLayer } from '@/types/navigation';
import { Home } from 'lucide-react';

export function BreadcrumbNav({
  stack,
  onPushClick
}: {
  stack: NavigationLayer<unknown>[];
  onPushClick: (index: number) => void;
}) {
  const getBreadcrumbLabel = (layer: NavigationLayer<unknown>) => {
    switch (layer.type) {
      case 'proyect-stages':
        return 'Etapas';
      case 'proyect-blocks':
        return 'Manzanas';
      case 'proyect-lots':
        return 'Lotes';
      default:
        return 'Proyectos';
    }
  };
  return (
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        {stack.length === 0 ? (
          <BreadcrumbItem className="inline-flex items-center gap-2">
            <Home className="w-4" />
            <BreadcrumbPage>Proyectos</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem className="inline-flex items-center gap-2">
              <Home className="w-4" />
              <Button
                variant="ghost"
                className="h-auto bg-transparent p-0 text-sm font-normal text-blue-500 transition-colors hover:bg-transparent hover:text-blue-400"
                onClick={() => onPushClick(0 - 1)}
              >
                Proyectos
              </Button>
            </BreadcrumbItem>

            {stack.map((layer, index) => (
              <div key={`breadcrumb-${index}`} style={{ display: 'contents' }}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === stack.length - 1 ? (
                    <BreadcrumbPage className="">{getBreadcrumbLabel(layer)}</BreadcrumbPage>
                  ) : (
                    <Button
                      variant="ghost"
                      className="h-auto bg-transparent p-0 text-sm font-normal text-blue-500 transition-colors hover:bg-transparent hover:text-blue-400"
                      onClick={() => onPushClick(index)}
                    >
                      {getBreadcrumbLabel(layer)}
                    </Button>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
