import { LeadSource } from '@/types/leads.types';
import { Info } from 'lucide-react';
import React from 'react';
import UpdateLeadSourceButton from './buttons/UpdateLeadSourceButton';

type Props = {
  data: LeadSource[];
};

const LeadSourceCards = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="text-muted-foreground bg-muted/5 flex flex-col items-center justify-center rounded-md border px-4 py-8 text-center">
        <Info className="text-muted-foreground/70 mb-2 h-12 w-12" />
        <p>No se encontraron resultados</p>
        <p className="mt-1 text-sm">Intenta ajustar los filtros para ver más resultados</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((source) => (
        <div
          key={source.id}
          className="rounded-md border p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold">{source.name}</h3>
          <p className="text-muted-foreground text-sm">{source.isActive ? 'Activo' : 'Inactivo'}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Creado el {new Date(source.createdAt).toLocaleDateString()}
          </p>
          <UpdateLeadSourceButton source={source} />
        </div>
      ))}
    </div>
  );
};

export default LeadSourceCards;
