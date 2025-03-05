import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StageDetailDto } from "@/types/project.types";

interface ProjectStagesProps {
  stages: StageDetailDto[];
}

export default function ProjectStages({ stages }: ProjectStagesProps) {
  if (!stages.length) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">Este proyecto no tiene etapas registradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stages.map((stage) => (
        <Card key={stage.id} className={!stage.isActive ? "opacity-70" : undefined}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Etapa: {stage.name}</CardTitle>
              <Badge variant={stage.isActive ? "default" : "secondary"}>
                {stage.isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <CardDescription>
              {stage.blocks.length} {stage.blocks.length === 1 ? "Manzana" : "Manzanas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stage.blocks.length > 0 ? (
              <div className="space-y-4">
                {stage.blocks.map((block) => {
                  // Calcular porcentajes para la barra de progreso
                  const total = block.lotCount;
                  const percentages = {
                    active: (block.activeLots / total) * 100,
                    reserved: (block.reservedLots / total) * 100,
                    sold: (block.soldLots / total) * 100,
                    inactive: (block.inactiveLots / total) * 100,
                  };

                  return (
                    <div key={block.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Manzana: {block.name}</div>
                        <Badge 
                          variant={block.isActive ? "outline" : "secondary"} 
                          className="text-xs"
                        >
                          {block.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      
                      <div className="mb-2 text-sm text-gray-600">
                        {block.lotCount} {block.lotCount === 1 ? "Lote" : "Lotes"}
                      </div>
                      
                      {/* Barra de progreso para visualizar estados */}
                      <div className="h-2 flex rounded-full overflow-hidden bg-gray-100">
                        {percentages.active > 0 && (
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${percentages.active}%` }} 
                            title={`Activos: ${block.activeLots}`}
                          />
                        )}
                        {percentages.reserved > 0 && (
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${percentages.reserved}%` }} 
                            title={`Separados: ${block.reservedLots}`}
                          />
                        )}
                        {percentages.sold > 0 && (
                          <div 
                            className="bg-purple-500" 
                            style={{ width: `${percentages.sold}%` }} 
                            title={`Vendidos: ${block.soldLots}`}
                          />
                        )}
                        {percentages.inactive > 0 && (
                          <div 
                            className="bg-gray-300" 
                            style={{ width: `${percentages.inactive}%` }} 
                            title={`Inactivos: ${block.inactiveLots}`}
                          />
                        )}
                      </div>
                      
                      {/* Leyenda de colores */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                          <span>Activos: {block.activeLots}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                          <span>Separados: {block.reservedLots}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
                          <span>Vendidos: {block.soldLots}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-300 mr-1" />
                          <span>Inactivos: {block.inactiveLots}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 border rounded-md bg-gray-50">
                <p className="text-gray-500">Esta etapa no tiene manzanas registradas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}