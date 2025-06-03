import { NavigationLayer } from '@/types/navigation';
import { ProyectsActivesItems } from '@/types/sales';
import ProyectsLayer from './ProyectsLayer';
import BlocksLayer from './BlocksLayer';
import LotsLayer from './LotsLayer';
import StagesLayer from './StagesLayer';

interface Props {
  data: ProyectsActivesItems[];
  currentLayer: NavigationLayer<unknown>;
  pushLayer: <T>(type: string, title: string, data?: T) => void;
  popLayer: () => void;
}

export default function RenderLayer({ data, currentLayer, pushLayer, popLayer }: Props) {
  if (!currentLayer)
    return (
      <ProyectsLayer
        data={data}
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
}
