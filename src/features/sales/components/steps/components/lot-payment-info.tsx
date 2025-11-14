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
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <Receipt className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">Resumen del Lote</h3>
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
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Edit className="h-3 w-3" />
                  <span className="font-medium">Edición habilitada</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Precio del Lote */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                className="p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
                    <Receipt className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="lotPrice" className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
                      Precio del Lote
                    </Label>
                    {isEditEnabled ? (
                      <Input
                        id="lotPrice"
                        type="number"
                        step="0.01"
                        value={lotPrice}
                        onChange={(e) => handleLotPriceChange(e.target.value)}
                        className="h-8 text-sm font-bold"
                      />
                    ) : (
                      <p className="text-sm font-bold text-primary truncate">
                        {formatCurrency(lotPrice, currencyType)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Habilitación Urbana */}
              {hasUrbanization && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-lg bg-background/50 border border-border"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="urbanizationPrice" className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
                        Habilitación Urbana
                      </Label>
                      {isEditEnabled ? (
                        <Input
                          id="urbanizationPrice"
                          type="number"
                          step="0.01"
                          value={urbanizationPrice}
                          onChange={(e) => handleUrbanizationPriceChange(e.target.value)}
                          className="h-8 text-sm font-bold"
                        />
                      ) : (
                        <p className="text-sm font-bold text-primary truncate">
                          {formatCurrency(urbanizationPrice, currencyType)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Área */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hasUrbanization ? 0.2 : 0.1 }}
                className="p-3 rounded-lg bg-background/50 border border-border"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
                    <Ruler className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Área</p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {selectedLot.area} m²
                    </p>
                  </div>
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
