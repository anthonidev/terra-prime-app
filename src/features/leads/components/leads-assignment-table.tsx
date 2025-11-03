'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { UserPlus, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableWithSelection } from '@/shared/components/data-table/data-table-with-selection';
import { AssignVendorModal } from './assign-vendor-modal';
import type { Lead } from '../types';

interface LeadsAssignmentTableProps {
  leads: Lead[];
}

export function LeadsAssignmentTable({ leads }: LeadsAssignmentTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedLeadNames, setSelectedLeadNames] = useState<string[]>([]);

  const handleAssignMultiple = (selectedRows: Lead[]) => {
    const ids = selectedRows.map((lead) => lead.id);
    const names = selectedRows.map(
      (lead) => `${lead.firstName} ${lead.lastName}`
    );
    setSelectedLeadIds(ids);
    setSelectedLeadNames(names);
    setIsModalOpen(true);
  };

  const handleAssignSingle = (lead: Lead) => {
    setSelectedLeadIds([lead.id]);
    setSelectedLeadNames([`${lead.firstName} ${lead.lastName}`]);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div>
            <div className="font-medium">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{lead.document}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.original.email;
        return email || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }) => {
        const phone = row.original.phone;
        return phone || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: 'age',
      header: 'Edad',
      cell: ({ row }) => {
        const age = row.original.age;
        return age ? `${age} años` : <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: 'isInOffice',
      header: 'Estado',
      cell: ({ row }) => {
        const isInOffice = row.original.isInOffice;
        return (
          <Badge variant={isInOffice ? 'default' : 'secondary'}>
            {isInOffice ? 'En oficina' : 'Fuera'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Fuente',
      cell: ({ row }) => {
        const source = row.original.source;
        return source?.name || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: 'interestProjects',
      header: 'Proyectos',
      cell: ({ row }) => {
        const projects = row.original.interestProjects;
        if (!projects || projects.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {projects.slice(0, 2).map((project, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {project}
              </Badge>
            ))}
            {projects.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{projects.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'vendor',
      header: 'Vendedor Asignado',
      cell: ({ row }) => {
        const vendor = row.original.vendor;
        if (!vendor) {
          return (
            <Badge variant="secondary" className="text-xs">
              Sin asignar
            </Badge>
          );
        }
        return (
          <div>
            <div className="font-medium text-sm">
              {vendor.firstName} {vendor.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{vendor.document}</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const lead = row.original;
        const hasVendor = !!lead.vendor;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssignSingle(lead)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {hasVendor ? 'Reasignar' : 'Asignar'}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/leads/detalle/${lead.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTableWithSelection
        columns={columns}
        data={leads}
        selectionAction={{
          label: 'Asignar seleccionados',
          onClick: handleAssignMultiple,
        }}
      />

      <AssignVendorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        leadIds={selectedLeadIds}
        leadNames={selectedLeadNames}
      />
    </>
  );
}
