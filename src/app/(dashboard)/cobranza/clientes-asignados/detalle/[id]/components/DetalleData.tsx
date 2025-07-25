import DetalleTable from './DetalleTable';
import { listByClient } from '@infrastructure/server-actions/cobranza.actions';
import DetalleCard from './DetalleCard';

interface DetalleDataProps {
  id: number;
}

export default async function DetalleData({ id }: DetalleDataProps) {
  const items = await listByClient(id);

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <DetalleTable id={id} data={items} />
      </div>
      <div className="md:hidden">
        <DetalleCard id={id} data={items} />
      </div>
    </div>
  );
}
