import { getActiveLeadSources, getActiveLiners, getUbigeos } from '../action';
import NewLeadForm from './NewLeadForm';

export default async function NewLeadContent() {
  try {
    const [leadSourcesResponse, linersResponse, ubigeosResponse] = await Promise.all([
      getActiveLeadSources(),
      getActiveLiners(),
      getUbigeos()
    ]);

    if (!leadSourcesResponse.success || !linersResponse.success || !ubigeosResponse.success) {
      throw new Error('Failed to load required data');
    }

    return <NewLeadForm leadSources={leadSourcesResponse.data} ubigeos={ubigeosResponse.data} />;
  } catch (error) {
    console.error('Error loading new lead data:', error);

    return (
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <h3 className="text-destructive mb-2 text-lg font-semibold">
          Error al cargar los datos necesarios
        </h3>
        <p className="text-destructive/80 mb-4">
          No se pudieron cargar las fuentes de leads, liners o ubicaciones. Por favor, recarga la
          página.
        </p>
      </div>
    );
  }
}
