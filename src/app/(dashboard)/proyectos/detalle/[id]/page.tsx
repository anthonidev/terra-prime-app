"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { notFound, useParams } from "next/navigation";
import { useProject } from "@/hooks/project/useProjectReturn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import ProjectDetailHeader from "@/components/project/detalle/ProjectDetailHeader";
import ProjectLotFilters from "@/components/project/detalle/ProjectLotFilters";
import ProjectLotsTable from "@/components/project/detalle/ProjectLotsTable";
import ProjectStages from "@/components/project/detalle/ProjectStages";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
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

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoadingDetail ? (
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <div className="flex gap-6 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        ) : (
          <ProjectDetailHeader project={projectDetail} />
        )}

        <Separator className="my-6" />

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-1">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:inline-flex">
              <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Información General
              </TabsTrigger>
              <TabsTrigger value="lots" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Lotes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="mt-3 space-y-4">
            {isLoadingDetail ? (
              <motion.div 
                variants={containerAnimation}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={itemAnimation}>
                  <Skeleton className="h-64 w-full" />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <Skeleton className="h-64 w-full mt-4" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProjectStages stages={projectDetail?.stages || []} />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="lots" className="mt-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectLotFilters 
                projectDetail={projectDetail}
                currentFilters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                isLoading={isLoadingDetail}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ProjectLotsTable 
                lots={lots}
                isLoading={isLoadingLots}
                totalItems={totalLots}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={Number(filters.limit) || 10}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}