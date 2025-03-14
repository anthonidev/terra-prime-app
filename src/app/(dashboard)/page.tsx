"use client";
import { LotStatusChart } from "@/components/charts/LotStatusChart";
import { RoleDistributionChart } from "@/components/charts/RoleDistributionChart";
import { useSession } from "next-auth/react";
export default function Home() {
  const {data:session}=useSession()
  return (
    <div className="flex flex-col gap-6 h-full w-full mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          session && session.user.role.code === "SYS" && (<> <RoleDistributionChart />
        <LotStatusChart /></>)
        }
       
      </div>
    </div>
  );
}