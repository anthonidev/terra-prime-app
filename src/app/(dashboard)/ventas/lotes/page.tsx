'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Box } from 'lucide-react';
import { useNavigationStack } from '@hooks/navigation/useNavigationStack';
import { useProyectsActives } from '../hooks/useProyectsActives';
import { BreadcrumbNav } from '../components/BreadcrumbNav';

import ProyectsLayer from '../components/ProyectsLayer';
import StagesLayer from '../components/StagesLayer';
import BlocksLayer from '../components/BlocksLayer';
import LotsLayer from '../components/LotsLayer';

export default function LotesPage() {
  const { data, isLoading, error } = useProyectsActives();
  const { stack, currentLayer, pushLayer, popLayer } = useNavigationStack();

  const renderCurrentLayer = () => {
    if (!currentLayer)
      return (
        <ProyectsLayer
          data={data}
          isLoading={isLoading}
          error={error}
          onPushClick={(project) => pushLayer('proyect-stages', project.name, project.id)}
        />
      );

    switch (currentLayer.type) {
      case 'proyect-stages':
        return (
          <StagesLayer
            projectId={currentLayer.data as string}
            onPushClick={(stage) => pushLayer('proyect-blocks', stage.name, stage.id)}
            onBack={popLayer}
          />
        );
      case 'proyect-blocks':
        return (
          <BlocksLayer
            stageId={currentLayer.data as string}
            onPushClick={(block) => pushLayer('proyect-lots', block.name, block.id)}
            onBack={popLayer}
          />
        );
      case 'proyect-lots':
        return <LotsLayer blockId={currentLayer.data as string} onBack={popLayer} />;
      default:
        return null;
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const layersToPop = stack.length - index - 1;
    for (let i = 0; i < layersToPop; i++) {
      popLayer();
    }
  };

  return (
    <div className="container pt-8">
      <BreadcrumbNav stack={stack} onPushClick={handleBreadcrumbClick} />
      <PageHeader
        icon={Box}
        title={stack.map((layer) => layer.title).join(' / ') || 'Lorem Ipsum'}
        subtitle="lorem ipsum dolor sit amet, consectetur adipiscing elit"
        variant="default"
      />
      {renderCurrentLayer()}
    </div>
  );
}
