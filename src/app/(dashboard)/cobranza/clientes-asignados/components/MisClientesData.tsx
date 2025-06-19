import MisClientesTable from './MisClientesTable';
import { getClientsByUser } from '@infrastructure/server-actions/cobranza.actions';
import MisClientesCard from './MisClientesCard';

export default async function MisClientesData() {
  const items = await getClientsByUser();

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <MisClientesTable data={items} />
      </div>
      <div className="md:hidden">
        <MisClientesCard data={items} />
      </div>
    </div>
  );
}
