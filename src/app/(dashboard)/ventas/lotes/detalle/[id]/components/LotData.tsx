import { TableQueryPagination } from '@components/common/table/TableQueryPagination';
import { getLotsProject } from '@infrastructure/server-actions/lotes.actions';

import LotTable from './LotTable';
import LotCard from './LotCard';

interface Props {
  id: string;
}

export default async function LotData({ id }: Props) {
  const { items, meta } = await getLotsProject(id);

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <LotTable data={items} />
      </div>

      <div className="md:hidden">
        <LotCard data={items} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
