"use client";


import ProjectDetailHeader from "@/components/project/detalle/ProjectDetailHeader";
import ProjectLotFilters from "@/components/project/detalle/ProjectLotFilters";
import ProjectLotsTable from "@/components/project/detalle/ProjectLotsTable";
import ProjectStages from "@/components/project/detalle/ProjectStages";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/hooks/project/useProjectReturn";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState("info");
  
  const {
    projectDetail,
    lots,
    totalLots,
    totalPages,
    currentPage,
    isLoadingDetail,
    isLoadingLots,
    error,
    filters,
    setFilters,
    setPage,
    resetFilters
  } = useProject({ projectId: params.id });

  if (!isLoadingDetail && !projectDetail && !error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      {isLoadingDetail ? (
        <div className="mb-6">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ) : (
        <ProjectDetailHeader project={projectDetail} />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="info">Información General</TabsTrigger>
          <TabsTrigger value="lots">Lotes</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          {isLoadingDetail ? (
            <div className="grid grid-cols-1 gap-4">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ProjectStages stages={projectDetail?.stages || []} />
          )}
        </TabsContent>

        <TabsContent value="lots" className="mt-4">
          <ProjectLotFilters 
            projectDetail={projectDetail}
            currentFilters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            isLoading={isLoadingDetail}
          />

          <div className="mt-4">
            <ProjectLotsTable 
              lots={lots}
              isLoading={isLoadingLots}
              totalItems={totalLots}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={Number(filters.limit) || 10}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}