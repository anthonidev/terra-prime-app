import type { DocumentType } from '../types';

export const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carné de Extranjería' },
  { value: 'RUC', label: 'RUC' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Soltero', label: 'Soltero/a' },
  { value: 'Casado', label: 'Casado/a' },
  { value: 'Divorciado', label: 'Divorciado/a' },
  { value: 'Viudo', label: 'Viudo/a' },
  { value: 'Conviviente', label: 'Conviviente' },
];
