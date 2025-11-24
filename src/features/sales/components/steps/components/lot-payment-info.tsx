'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Home, Ruler, Edit, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { RequestEditModal } from '../../dialogs/request-edit-modal';
import type { ProjectLotResponse } from '../../../types';

interface LotPaymentInfoProps {
  selectedLot: ProjectLotResponse;
  lotPrice: number;
  urbanizationPrice: number;
  hasUrbanization: boolean;
  isEditEnabled?: boolean;
  onEditEnabledChange?: (enabled: boolean) => void;
  onLotPriceChange?: (price: number) => void;
  onUrbanizationPriceChange?: (price: number) => void;
}

export function LotPaymentInfo({
  selectedLot,
  lotPrice,
  urbanizationPrice,
  hasUrbanization,
  isEditEnabled = false,
  onEditEnabledChange,
  onLotPriceChange,
  onUrbanizationPriceChange,
}: LotPaymentInfoProps) {
  const [requestEditModalOpen, setRequestEditModalOpen] = useState(false);
  const currencyType = selectedLot.projectCurrency === 'USD' ? 'USD' : 'PEN';

  const handleEditSuccess = () => {
    onEditEnabledChange?.(true);
  };

  const handleLotPriceChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onLotPriceChange?.(numValue);
    }
  };

  const handleUrbanizationPriceChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onUrbanizationPriceChange?.(numValue);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Receipt className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Resumen del Lote</h3>
                  <p className="text-muted-foreground text-sm">Información base para el cálculo</p>
                </div>
              </div>

              {!isEditEnabled && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setRequestEditModalOpen(true)}
                  className="gap-2"
                >
                  <Lock className="h-3 w-3" />
                  Solicitar Edición
                </Button>
              )}

              {isEditEnabled && (
                <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                  <Edit className="h-3 w-3" />
                  <span>Edición habilitada</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Precio del Lote */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="lotPrice"
                  className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                >
                  <Receipt className="h-3 w-3" />
                  Precio del Lote
                </Label>
                <div className="bg-muted/30 rounded-lg p-3">
                  {isEditEnabled ? (
                    <div className="relative">
                      <Input
                        id="lotPrice"
                        type="number"
                        step="0.01"
                        value={lotPrice}
                        onChange={(e) => handleLotPriceChange(e.target.value)}
                        className="h-9 pl-8 font-mono font-bold"
                      />
                      <span className="text-muted-foreground absolute top-2.5 left-3 text-xs">
                        $
                      </span>
                    </div>
                  ) : (
                    <p className="text-foreground text-xl font-bold">
                      {formatCurrency(lotPrice, currencyType)}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Habilitación Urbana */}
              {hasUrbanization && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="urbanizationPrice"
                    className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                  >
                    <Home className="h-3 w-3" />
                    Habilitación Urbana
                  </Label>
                  <div className="bg-muted/30 rounded-lg p-3">
                    {isEditEnabled ? (
                      <div className="relative">
                        <Input
                          id="urbanizationPrice"
                          type="number"
                          step="0.01"
                          value={urbanizationPrice}
                          onChange={(e) => handleUrbanizationPriceChange(e.target.value)}
                          className="h-9 pl-8 font-mono font-bold"
                        />
                        <span className="text-muted-foreground absolute top-2.5 left-3 text-xs">
                          $
                        </span>
                      </div>
                    ) : (
                      <p className="text-foreground text-xl font-bold">
                        {formatCurrency(urbanizationPrice, currencyType)}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Área */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hasUrbanization ? 0.2 : 0.1 }}
                className="space-y-2"
              >
                <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
                  <Ruler className="h-3 w-3" />
                  Área Total
                </Label>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-foreground text-xl font-bold">{selectedLot.area} m²</p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Edit Modal */}
      <RequestEditModal
        open={requestEditModalOpen}
        onOpenChange={setRequestEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
