import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validateProjectExcel, createBulkProject } from '@/lib/actions/projects/projectActions';
import { ExcelValidationResponse } from '@/types/project.types';
type UploadStep = 'upload' | 'review' | 'success';
export function useProjectUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [validationResult, setValidationResult] = useState<ExcelValidationResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const router = useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const isExcel =
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        toast.error('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
        return;
      }
      setFile(selectedFile);
      setValidationResult(null);
    } else {
      setFile(null);
      setValidationResult(null);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        droppedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile(droppedFile);
        setValidationResult(null);
      } else {
        toast.error('Por favor, sube un archivo Excel (.xlsx o .xls)');
      }
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const validateExcel = async () => {
    if (!file) {
      toast.error('Por favor, selecciona un archivo Excel');
      return;
    }
    setIsValidating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await validateProjectExcel(formData);
      setValidationResult(result);
      if (result.isValid && result.data) {
        setCurrentStep('review');
        toast.success('Archivo validado correctamente');
      } else {
        toast.error('El archivo contiene errores. Por favor, revisa los detalles.');
      }
    } catch (error) {
      console.error('Error al validar el archivo:', error);
      toast.error('Error al validar el archivo Excel');
    } finally {
      setIsValidating(false);
    }
  };
  const createProject = async () => {
    if (!file || !validationResult?.isValid) {
      toast.error('No hay archivo válido para crear el proyecto');
      return;
    }
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await createBulkProject(formData);
      setCurrentStep('success');
      toast.success('Proyecto creado correctamente');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al crear el proyecto');
      }
    } finally {
      setIsCreating(false);
    }
  };
  const resetUpload = () => {
    setFile(null);
    setValidationResult(null);
    setCurrentStep('upload');
  };
  const goToProjectsList = () => {
    router.push('/proyectos');
  };
  return {
    file,
    isValidating,
    isCreating,
    validationResult,
    currentStep,
    setValidationResult,
    handleFileChange,
    handleDrop,
    handleDragOver,
    validateExcel,
    createProject,
    resetUpload,
    goToProjectsList,
    setFile
  };
}
