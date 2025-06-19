'use client';

import { useNavigationStack } from '@hooks/navigation/useNavigationStack';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Project } from '@domain/entities/lotes/project.entity';
import RenderLayer from './layer/RenderLayer';

export default function LayerContainer({ data }: { data: Project[] }) {
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
