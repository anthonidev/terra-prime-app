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
        <Card className="border-primary/20 from-primary/5 border-2 bg-gradient-to-br to-transparent">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Receipt className="text-primary h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Resumen del Lote</h3>
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
                <div className="text-primary flex items-center gap-2 text-xs">
                  <Edit className="h-3 w-3" />
                  <span className="font-medium">Edición habilitada</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Precio del Lote */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
                className="bg-background/50 border-border rounded-lg border p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md">
                    <Receipt className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Label
                      htmlFor="lotPrice"
                      className="text-muted-foreground mb-1 block text-[10px] tracking-wide uppercase"
                    >
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
                      <p className="text-primary truncate text-sm font-bold">
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
                  className="bg-background/50 border-border rounded-lg border p-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md">
                      <Home className="text-primary h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Label
                        htmlFor="urbanizationPrice"
                        className="text-muted-foreground mb-1 block text-[10px] tracking-wide uppercase"
                      >
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
                        <p className="text-primary truncate text-sm font-bold">
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
                className="bg-background/50 border-border rounded-lg border p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md">
                    <Ruler className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground mb-0.5 text-[10px] tracking-wide uppercase">
                      Área
                    </p>
                    <p className="text-foreground truncate text-sm font-bold">
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
