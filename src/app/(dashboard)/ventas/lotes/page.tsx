'use client';

import { PageHeader } from '@/components/common/PageHeader';
import LayerContainer from '@sales/lotes/components/LayerContainer';
import { useEffect, useState } from 'react';
import { getProjectActives } from '@infrastructure/server-actions/lotes.actions';
import { Project } from '@/lib/domain/entities/lotes/project.entity';

export default function LotesPage() {
  const [data, setData] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getProjectActives();
        setData(projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageHeader title="Lotes" subtitle="listado de lotes por precio" variant="gradient" />
      <LayerContainer data={data} />
    </div>
  );
}
