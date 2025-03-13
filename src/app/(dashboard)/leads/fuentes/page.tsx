"use client";

import LeadSourcesTable from "@/components/leads/source/LeadSoucesTable";
import React from "react";

export default function LeadSourcesPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Fuentes de Leads</h1>
        <p className="text-muted-foreground">
          Gestiona las fuentes de adquisición de leads
        </p>
      </div>
      <LeadSourcesTable />
    </div>
  );
}
