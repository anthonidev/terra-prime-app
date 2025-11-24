'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Building2, UserPlus, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTableWithSelection } from '@/shared/components/data-table/data-table-with-selection';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { AssignVendorModal } from '../dialogs/assign-vendor-modal';
import { LeadAssignmentCard } from '../cards/lead-assignment-card';
import { UserInfo } from '@/shared/components/user-info';
import type { Lead } from '../../types';

interface LeadsAssignmentTableProps {
  leads: Lead[];
}

export function LeadsAssignmentTable({ leads }: LeadsAssignmentTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedLeadNames, setSelectedLeadNames] = useState<string[]>([]);

  const handleAssignMultiple = (selectedRows: Lead[]) => {
    const ids = selectedRows.map((lead) => lead.id);
    const names = selectedRows.map((lead) => `${lead.firstName} ${lead.lastName}`);
    setSelectedLeadIds(ids);
    setSelectedLeadNames(names);
    setIsModalOpen(true);
  };

  const handleAssignSingle = (lead: Lead) => {
    setSelectedLeadIds([lead.id]);
    setSelectedLeadNames([`${lead.firstName} ${lead.lastName}`]);
    setIsModalOpen(true);
  };

  const handleMobileSelect = (leadId: string, isSelected: boolean) => {
    setSelectedLeadIds((prev) =>
      isSelected ? [...prev, leadId] : prev.filter((id) => id !== leadId)
    );
  };

  const handleMobileAssignSelected = () => {
    const selectedLeads = leads.filter((lead) => selectedLeadIds.includes(lead.id));
    if (selectedLeads.length > 0) {
      handleAssignMultiple(selectedLeads);
    }
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'firstName',
      header: 'Lead',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div>
            <div className="text-xs font-bold">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-xs">
                {lead.documentType}
              </Badge>
              <span className="text-muted-foreground text-xs">{lead.document}</span>
            </div>
            {lead.email && (
              <div className="text-muted-foreground mt-0.5 truncate text-xs">{lead.email}</div>
            )}
            {lead.phone && <div className="text-muted-foreground mt-0.5 text-xs">{lead.phone}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: 'isInOffice',
      header: 'Estado',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="space-y-1">
            {lead.isInOffice && (
              <Badge className="bg-success text-success-foreground text-xs">
                <Building2 className="mr-1 h-3 w-3" />
                En Oficina
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'interestProjects',
      header: 'Proyectos',
      cell: ({ row }) => {
        const projects = row.original.interestProjects;
        if (!projects || projects.length === 0) {
          return <span className="text-muted-foreground text-xs">-</span>;
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
      header: 'Vendedor',
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
          <UserInfo
            name={`${vendor.firstName} ${vendor.lastName}`}
            document={vendor.document}
            className="gap-2"
          />
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
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssignSingle(lead)}
              className="h-8"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              {hasVendor ? 'Reasignar' : 'Asignar'}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/leads/detalle/${lead.id}`}>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  if (isMobile) {
    return (
      <>
        {/* Botón para asignar seleccionados en mobile */}
        {selectedLeadIds.length > 0 && (
          <div className="mb-4">
            <Button onClick={handleMobileAssignSelected} className="w-full" size="sm">
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Asignar seleccionados ({selectedLeadIds.length})
            </Button>
          </div>
        )}

        {/* Cards Mobile */}
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadAssignmentCard
              key={lead.id}
              lead={lead}
              onAssign={handleAssignSingle}
              isSelected={selectedLeadIds.includes(lead.id)}
              onSelect={handleMobileSelect}
            />
          ))}
        </div>

        <AssignVendorModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          leadIds={selectedLeadIds}
          leadNames={selectedLeadNames}
        />
      </>
    );
  }

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
