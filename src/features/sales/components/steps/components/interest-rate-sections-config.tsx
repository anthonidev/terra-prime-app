'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Percent, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/lib/utils';
import type { InterestRateSection } from '../../../types';

interface InterestRateSectionsConfigProps {
  sections: InterestRateSection[];
  totalInstallments: number;
  isLocked?: boolean;
  onSectionsChange: (sections: InterestRateSection[]) => void;
}

export function InterestRateSectionsConfig({
  sections,
  totalInstallments,
  isLocked = false,
  onSectionsChange,
}: InterestRateSectionsConfigProps) {
  // Local string state for rate inputs to allow typing "0", clearing, etc.
  const [rateInputs, setRateInputs] = useState<string[]>(
    sections.map((s) => String(s.interestRate))
  );

  // Sync local inputs when sections change externally (add/remove/reset)
  useEffect(() => {
    setRateInputs((prev) => {
      if (prev.length !== sections.length) {
        return sections.map((s) => String(s.interestRate));
      }
      return prev;
    });
  }, [sections.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (totalInstallments < 1) return null;

  const handleRateChange = (index: number, rate: number) => {
    const updated = sections.map((s, i) => (i === index ? { ...s, interestRate: rate } : s));
    onSectionsChange(updated);
  };

  const handleEndInstallmentChange = (index: number, end: number) => {
    if (index === sections.length - 1) return; // Last section end is auto
    if (end < sections[index].startInstallment) return;
    if (end >= totalInstallments) return;

    const updated = [...sections];
    updated[index] = { ...updated[index], endInstallment: end };

    // Auto-adjust subsequent section starts
    for (let i = index + 1; i < updated.length; i++) {
      updated[i] = {
        ...updated[i],
        startInstallment: updated[i - 1].endInstallment + 1,
      };
      // If this is the last section, ensure it ends at totalInstallments
      if (i === updated.length - 1) {
        updated[i].endInstallment = totalInstallments;
      }
    }

    // Validate: no section should have start > end
    const isValid = updated.every((s) => s.startInstallment <= s.endInstallment);
    if (isValid) {
      onSectionsChange(updated);
    }
  };

  const handleAddSection = () => {
    if (sections.length === 0) return;

    const lastSection = sections[sections.length - 1];
    const range = lastSection.endInstallment - lastSection.startInstallment + 1;

    if (range < 2) return; // Can't split a single-installment section

    // Split the last section in half
    const splitPoint = lastSection.startInstallment + Math.floor(range / 2) - 1;

    const updated = [
      ...sections.slice(0, -1),
      { ...lastSection, endInstallment: splitPoint },
      {
        startInstallment: splitPoint + 1,
        endInstallment: totalInstallments,
        interestRate: lastSection.interestRate,
      },
    ];
    onSectionsChange(updated);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;

    const updated = sections.filter((_, i) => i !== index);

    // Recalculate starts and ensure last section ends at totalInstallments
    for (let i = 0; i < updated.length; i++) {
      if (i === 0) {
        updated[i] = { ...updated[i], startInstallment: 1 };
      } else {
        updated[i] = {
          ...updated[i],
          startInstallment: updated[i - 1].endInstallment + 1,
        };
      }
      if (i === updated.length - 1) {
        updated[i] = { ...updated[i], endInstallment: totalInstallments };
      }
    }

    onSectionsChange(updated);
  };

  // Validation
  const lastEnd = sections.length > 0 ? sections[sections.length - 1].endInstallment : 0;
  const coversAll = lastEnd === totalInstallments;
  const hasGaps = sections.some(
    (s, i) => i > 0 && s.startInstallment !== sections[i - 1].endInstallment + 1
  );
  const hasInvalidRanges = sections.some((s) => s.startInstallment > s.endInstallment);
  const isValid = coversAll && !hasGaps && !hasInvalidRanges;
  const canAddMore =
    sections.length > 0 &&
    sections[sections.length - 1].endInstallment -
      sections[sections.length - 1].startInstallment +
      1 >=
      2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Tasas de Interes</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {sections.length} {sections.length === 1 ? 'tramo' : 'tramos'}
                  </Badge>
                </div>
                <CardDescription>
                  Define las tasas de interes por rangos de cuotas (1 a {totalInstallments})
                </CardDescription>
              </div>
            </div>
            {!isLocked && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                disabled={!canAddMore}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Agregar tramo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sections.map((section, index) => {
            const isLastSection = index === sections.length - 1;
            const rangeSize = section.endInstallment - section.startInstallment + 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'grid items-end gap-3 rounded-lg border p-3',
                  sections.length === 1
                    ? 'grid-cols-[1fr_1fr_auto]'
                    : 'grid-cols-[1fr_1fr_auto_auto]'
                )}
              >
                {/* Range */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Rango de cuotas</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={section.startInstallment}
                      disabled
                      className="bg-muted h-9 w-20 cursor-not-allowed text-center"
                    />
                    <span className="text-muted-foreground text-sm">a</span>
                    <Input
                      type="number"
                      value={section.endInstallment}
                      disabled={isLocked || isLastSection}
                      min={section.startInstallment}
                      max={totalInstallments - 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) handleEndInstallmentChange(index, val);
                      }}
                      className={cn(
                        'h-9 w-20 text-center',
                        (isLocked || isLastSection) && 'bg-muted cursor-not-allowed'
                      )}
                    />
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    {rangeSize} {rangeSize === 1 ? 'cuota' : 'cuotas'}
                  </p>
                </div>

                {/* Rate */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Tasa mensual (%)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={rateInputs[index] ?? ''}
                      disabled={isLocked}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setRateInputs((prev) => {
                          const next = [...prev];
                          next[index] = raw;
                          return next;
                        });
                        const val = parseFloat(raw);
                        if (!isNaN(val) && val >= 0 && val <= 100) {
                          handleRateChange(index, val);
                        }
                      }}
                      onBlur={() => {
                        // On blur, if empty or invalid, reset to the section value
                        const val = parseFloat(rateInputs[index]);
                        if (isNaN(val) || val < 0) {
                          handleRateChange(index, 0);
                          setRateInputs((prev) => {
                            const next = [...prev];
                            next[index] = '0';
                            return next;
                          });
                        }
                      }}
                      className={cn('h-9 pl-8', isLocked && 'bg-muted cursor-not-allowed')}
                    />
                    <Percent className="text-muted-foreground absolute top-2 left-2.5 h-4 w-4" />
                  </div>
                </div>

                {/* Info badge */}
                <div className="flex items-center pb-5">
                  <Badge
                    variant={section.interestRate === 0 ? 'secondary' : 'default'}
                    className="text-[10px] whitespace-nowrap"
                  >
                    {section.interestRate === 0 ? 'Sin interes' : `${section.interestRate}%`}
                  </Badge>
                </div>

                {/* Delete button */}
                {sections.length > 1 && !isLocked && (
                  <div className="flex items-center pb-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => handleRemoveSection(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Validation message */}
          {!isValid && (
            <p className="text-destructive text-xs">
              Los tramos deben cubrir todas las cuotas del 1 al {totalInstallments} sin huecos.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
