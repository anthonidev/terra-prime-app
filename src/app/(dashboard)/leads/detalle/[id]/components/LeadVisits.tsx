'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/leads.types';
import { History } from 'lucide-react';
import LeadVisitsTable from './LeadVisitsTable';
import LeadVisitsCards from './LeadVisitsCards';

interface LeadVisitsProps {
  lead: Lead | null;
}

export default function LeadVisits({ lead }: LeadVisitsProps) {
  if (!lead) return null;

  // Empty state
  if (!lead.visits || lead.visits.length === 0) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Historial de visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <History className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Sin visitas registradas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Este lead aún no tiene visitas registradas en el sistema
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Historial de visitas
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {lead.visits.length} visita{lead.visits.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <LeadVisitsTable visits={lead.visits} />
        </div>

        {/* Mobile Cards View */}
        <div className="p-6 md:hidden">
          <LeadVisitsCards visits={lead.visits} />
        </div>
      </CardContent>
    </Card>
  );
}
