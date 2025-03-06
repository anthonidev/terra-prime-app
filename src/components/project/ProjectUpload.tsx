"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProjectUpload } from "@/hooks/project/useProjectUpload";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ReviewStep from "./ReviewStep";
import SuccessStep from "./SuccessStep";
import UploadProgress from "./UploadProgress";
import UploadStep from "./UploadStep";
const ProjectUpload: React.FC = () => {
  const {
    file,
    isValidating,
    isCreating,
    validationResult,
    currentStep,
    handleFileChange,
    handleDrop,
    handleDragOver,
    validateExcel,
    createProject,
    resetUpload,
    goToProjectsList,
    setFile,
    setValidationResult,
  } = useProjectUpload();
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Importar proyecto desde Excel
            </CardTitle>
            <CardDescription>
              Sube un archivo Excel con los datos de tu proyecto y lotes
            </CardDescription>
          </div>
          <UploadProgress currentStep={currentStep} />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === "upload" && (
              <UploadStep
                file={file}
                setFile={setFile}
                isValidating={isValidating}
                validateExcel={validateExcel}
                handleFileChange={handleFileChange}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                validationResult={validationResult}
                setValidationResult={setValidationResult}
              />
            )}
            {currentStep === "review" && validationResult?.data && (
              <ReviewStep
                projectData={validationResult.data}
                isCreating={isCreating}
                createProject={createProject}
                resetUpload={resetUpload}
              />
            )}
            {currentStep === "success" && (
              <SuccessStep
                resetUpload={resetUpload}
                goToProjectsList={goToProjectsList}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
export default ProjectUpload;
