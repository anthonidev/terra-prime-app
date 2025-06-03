'use client';

import { useNavigationStack } from '@hooks/navigation/useNavigationStack';
import { BreadcrumbNav } from './BreadcrumbNav';
import { ProyectsActivesItems } from '@/types/sales';
import RenderLayer from './layer/RenderLayer';

export default function LayerContainer({ data }: { data: ProyectsActivesItems[] }) {
  const { stack, currentLayer, pushLayer, popLayer } = useNavigationStack();

  const handleBreadcrumbClick = (index: number) => {
    const layersToPop = stack.length - index - 1;
    for (let i = 0; i < layersToPop; i++) popLayer();
  };

  return (
    <div className="container">
      <BreadcrumbNav stack={stack} onPushClick={handleBreadcrumbClick} />
      <RenderLayer
        currentLayer={currentLayer}
        data={data}
        pushLayer={pushLayer}
        popLayer={popLayer}
      />
    </div>
  );
}
