import { TableQueryPagination } from '@components/common/table/TableQueryPagination';
import { getLotsProject } from '@infrastructure/server-actions/lotes.actions';

import LotTable from './LotTable';
import LotCard from './LotCard';
import { Card, CardContent } from '@/components/ui/card';
import TableFilter from './TableFilter';

interface Props {
  id: string;
  searchParams?: {
    order?: string;
    page?: string;
    limit?: string;
    stageId?: string;
    blockId?: string;
    term?: string;
  };
}

export default async function LotData({ id, searchParams }: Props) {
  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const stageId = searchParams?.stageId;
  const blockId = searchParams?.blockId;
  const term = searchParams?.term;

  const { items, meta } = await getLotsProject(id, {
    order,
    page,
    limit,
    stageId,
    blockId,
    term
  });

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <TableFilter
                projectId={id}
                order={order}
                initialStageId={stageId}
                initialBlockId={blockId}
                term={term}
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
