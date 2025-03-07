"use client";

import { LotStatusChart } from "@/components/charts/LotStatusChart";
import { RoleDistributionChart } from "@/components/charts/RoleDistributionChart";


export default function Home() {
  return (
    <div className="flex flex-col gap-6 h-full w-full mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleDistributionChart />
        <LotStatusChart />
      </div>
    </div>
  );
}