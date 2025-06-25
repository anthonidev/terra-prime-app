import { NavigationLayer } from '@/types/navigation';
import { Project } from '@domain/entities/lotes/project.entity';
import ProyectsLayer from './ProyectsLayer';
import BlocksLayer from './BlocksLayer';
import LotsLayer from './LotsLayer';
import StagesLayer from './StagesLayer';

interface Props {
  data: Project[];
  currentLayer: NavigationLayer<unknown>;
  pushLayer: <T>(type: string, title: string, data?: T) => void;
  popLayer: () => void;
}

export default function RenderLayer({ data, currentLayer, pushLayer, popLayer }: Props) {
  if (!currentLayer)
    return (
      <ProyectsLayer
        data={data}
        onPushClick={(project) => pushLayer('proyect-stages', project.name, project)}
      />
    );

  switch (currentLayer.type) {
    case 'proyect-stages':
      const project = currentLayer.data as Project;
      return (
        <StagesLayer
          projectId={project.id}
          onPushClick={(stage) =>
            pushLayer('proyect-blocks', stage.name, {
              stageId: stage.id,
              currency: project.currency
            })
          }
          onBack={popLayer}
        />
      );
    case 'proyect-blocks':
      const { stageId, currency } = currentLayer.data as { stageId: string; currency: string };
      return (
        <BlocksLayer
          stageId={stageId}
          onPushClick={(block) =>
            pushLayer('proyect-lots', block.name, { blockId: block.id, currency })
          }
          onBack={popLayer}
        />
      );
    case 'proyect-lots': {
      const { blockId, currency } = currentLayer.data as { blockId: string; currency: string };
      return <LotsLayer blockId={blockId} currency={currency} onBack={popLayer} />;
    }
    default:
      return null;
  }
}
