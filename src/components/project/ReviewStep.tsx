'use client';

import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table';
import { Lot, ProjectData } from '@infrastructure/types/projects/project.types';
import { Building2, Calculator, CheckCircle2, Landmark } from 'lucide-react';
import React from 'react';

interface ReviewStepProps {
  projectData: ProjectData;
  isCreating: boolean;
  createProject: () => Promise<void>;
  resetUpload: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  projectData,
  isCreating,
  createProject,
  resetUpload
}) => {
  const totalLots = projectData.lots.length;
  const totalArea = projectData.lots.reduce((sum, lot) => sum + lot.area, 0);
  const totalValue = projectData.lots.reduce(
    (sum, lot) => sum + lot.lotPrice + lot.urbanizationPrice,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: projectData.currency,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-accent border-accent-foreground/20">
        <CheckCircle2 className="text-accent-foreground h-4 w-4" />
        <AlertTitle>Validación exitosa</AlertTitle>
        <AlertDescription>
          El archivo ha sido validado correctamente. Revisa los detalles y confirma la creación del
          proyecto.
        </AlertDescription>
      </Alert>
      {}
      <ProjectSummaryCards
        projectName={projectData.name}
        totalLots={totalLots}
        totalArea={totalArea}
        totalValue={totalValue}
        currency={projectData.currency}
        formatCurrency={formatCurrency}
      />
      {}
      <LotsTable lots={projectData.lots} totalLots={totalLots} formatCurrency={formatCurrency} />
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={resetUpload}>
          Cancelar
        </Button>
        <Button
          onClick={createProject}
          disabled={isCreating}
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          {isCreating ? 'Creando proyecto...' : 'Crear proyecto'}
        </Button>
      </div>
    </div>
  );
};
interface ProjectSummaryCardsProps {
  projectName: string;
  totalLots: number;
  totalArea: number;
  totalValue: number;
  currency: string;
  formatCurrency: (value: number) => string;
}
const ProjectSummaryCards: React.FC<ProjectSummaryCardsProps> = ({
  projectName,
  totalLots,
  totalArea,
  totalValue,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Nombre del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Building2 className="text-primary mr-2 h-4 w-4" />
            <p className="text-2xl font-bold">{projectName}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Cantidad de Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calculator className="text-primary mr-2 h-4 w-4" />
            <div>
              <p className="text-2xl font-bold">{totalLots} lotes</p>
              <p className="text-muted-foreground text-sm">
                Área total: {totalArea.toLocaleString()} m²
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Valor Total del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Landmark className="text-primary mr-2 h-4 w-4" />
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
interface LotsTableProps {
  lots: Lot[];
  totalLots: number;
  formatCurrency: (value: number) => string;
}
const LotsTable: React.FC<LotsTableProps> = ({ lots, totalLots, formatCurrency }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle de lotes</CardTitle>
        <CardDescription>Se importarán {totalLots} lotes al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Bloque</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Área (m²)</TableHead>
                  <TableHead>Precio Lote</TableHead>
                  <TableHead>Precio Urb.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lots.map((lot: Lot, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{lot.stage}</TableCell>
                    <TableCell>{lot.block}</TableCell>
                    <TableCell>{lot.lot}</TableCell>
                    <TableCell>{lot.area.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(lot.lotPrice)}</TableCell>
                    <TableCell>{formatCurrency(lot.urbanizationPrice)}</TableCell>
                    <TableCell>{formatCurrency(lot.lotPrice + lot.urbanizationPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={lot.status === 'Activo' ? 'default' : 'outline'}>
                        {lot.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ReviewStep;
