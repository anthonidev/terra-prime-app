import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

import { useValidateExcel, useBulkCreateProject } from './use-bulk-create';
import type { ValidatedExcelData, ValidationError } from '../types';

type ValidationResult = {
  isValid: boolean;
  data?: ValidatedExcelData;
  errors?: ValidationError[];
} | null;

export function useNewProjectContainer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: validateExcel, isPending: isValidating } = useValidateExcel();
  const { mutate: bulkCreate, isPending: isCreating } = useBulkCreateProject();

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
        return;
      }

      setSelectedFile(file);
      setValidationResult(null);

      validateExcel(file, {
        onSuccess: (result) => {
          setValidationResult(result);
        },
      });
    },
    [validateExcel]
  );

  const handleDownloadTemplate = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/templates/plantilla-carga-proyecto.xlsx';
    link.download = 'plantilla-carga-proyecto.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleCreateProject = useCallback(() => {
    if (!selectedFile) return;
    bulkCreate(selectedFile);
  }, [bulkCreate, selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    selectedFile,
    validationResult,
    fileInputRef,
    isValidating,
    isCreating,
    handleFileChange,
    handleDownloadTemplate,
    handleCreateProject,
    handleReset,
  };
}
