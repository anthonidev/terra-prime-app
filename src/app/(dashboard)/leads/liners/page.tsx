"use client";

import LinersTable from "@/components/leads/liner/LinersTable";
import React from "react";

export default function LinersPage() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Liners</h1>
        <p className="text-muted-foreground">
          Gestiona los liners para la captación de leads
        </p>
      </div>
      <LinersTable />
    </div>
  );
}
