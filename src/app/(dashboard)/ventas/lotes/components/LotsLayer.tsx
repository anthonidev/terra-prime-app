'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { useProyectLots } from '../hooks/useProyectLots';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import { TableSkeleton } from '@/components/common/table/TableSkeleton';

interface Props {
  blockId: string;
  onBack: () => void;
}

export default function LotsLayer({ blockId, onBack }: Props) {
  const [searchData, setSearchData] = React.useState<string>('');
  const { lots, isLoading } = useProyectLots(blockId);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredData = React.useMemo(() => {
    return lots.filter((lot) => lot.name.toLowerCase().includes(searchData.toLowerCase()));
  }, [lots, searchData]);

  return (
    <div>
      <div className="inline-flex h-auto w-full items-center justify-between pb-4">
        <Button variant="outline" onClick={onBack} className="bg-white dark:bg-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="bg-white pl-10 text-sm dark:bg-gray-900"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : isMobile ? (
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((lot, index) => (
                <Card key={lot.id} className="overflow-hidden p-0">
                  <CardContent className="p-0">
                    <div className="flex flex-col divide-y">
                      <div className="flex items-center justify-between bg-gradient-to-r from-[#025864] to-[#00CA7C] p-4">
                        <StatusBadge status={lot.status} />
                        <div className="text-sm font-medium text-slate-100">
                          <span>#{index + 1}</span>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 text-sm font-medium">
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Lote:</div>
                          <div className="">{lot.name}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Área:</div>
                          <div className="">{lot.area}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio:</div>
                          <div className="">{lot.lotPrice}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio HU:</div>
                          <div className="">{lot.urbanizationPrice}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-muted-foreground text-sm">Precio Total:</div>
                          <div className="">{lot.totalPrice}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No hay reconsumos registrados</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Precio Lote</TableHead>
                  <TableHead>Precio HU</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio Final Lote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-medium">Lt {lot.name}</TableCell>
                    <TableCell className="font-medium">{lot.area} m²</TableCell>
                    <TableCell className="font-medium">{lot.lotPrice}</TableCell>
                    <TableCell className="font-medium">{lot.urbanizationPrice}</TableCell>
                    <TableCell>
                      <StatusBadge status={lot.status} />
                    </TableCell>
                    <TableCell className="font-medium">{lot.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
