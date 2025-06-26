import { Card, CardContent } from '@/components/ui/card';
import ParticipantesTableFilters from './ParticipantesTableFilters';
import ParticipantesTable from './ParticipantesTable';
import ParticipantesCards from './ParticipantesCards';
import { getParticipants } from '@infrastructure/server-actions/participant.actions';

export default async function ParticipantesData({
  searchParams
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const search = searchParams?.search || '';

  const data = await getParticipants({
    page,
    limit,
    search
  });

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <ParticipantesTableFilters search={search} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <ParticipantesTable data={data} />
      </div>

      <div className="md:hidden">
        <ParticipantesCards data={data} />
      </div>
    </div>
  );
}
