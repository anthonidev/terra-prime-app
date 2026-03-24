import type { ArrivalPlace, DocumentType } from '../types';

export const ARRIVAL_PLACE_OPTIONS: Array<{ value: ArrivalPlace; label: string }> = [
  { value: 'OFICINA', label: 'Oficina' },
  { value: 'CAMPO', label: 'Campo' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'OTROS', label: 'Otros' },
];

export enum EstadoCivil {
  Soltero = 'Soltero',
  Casado = 'Casado',
  Divorciado = 'Divorciado',
  Conviviente = 'Conviviente',
  Viudo = 'Viudo',
}
export const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carné de Extranjería' },
  { value: 'RUC', label: 'RUC' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: EstadoCivil.Soltero, label: 'Soltero' },
  { value: EstadoCivil.Casado, label: 'Casado' },
  { value: EstadoCivil.Divorciado, label: 'Divorciado' },
  { value: EstadoCivil.Conviviente, label: 'Conviviente' },
  { value: EstadoCivil.Viudo, label: 'Viudo' },
];
