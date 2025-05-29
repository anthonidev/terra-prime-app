import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Client, ClientGuarantorPayload, ClientGuarantorResponse } from '@/types/sales';
import { LeadsVendorItems } from '@/types/sales';
import { motion } from 'framer-motion';
import { Building, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormData } from '@/lib/validations/sales';

interface Props {
  client: Client | null;
  leadsData: LeadsVendorItems[];
  selectedLeadVendor: LeadsVendorItems | null;
  setSelectedLeadVendor: (value: React.SetStateAction<LeadsVendorItems | null>) => void;
  createClientGuarantor: (payload: ClientGuarantorPayload) => Promise<ClientGuarantorResponse>;
  form: UseFormReturn<SaleFormData>;
}

export function ClientStep({
  client,
  leadsData,
  selectedLeadVendor,
  setSelectedLeadVendor,
  createClientGuarantor
}: Props) {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<string>(client?.address || '');
  const [creationResult, setCreationResult] = useState<ClientGuarantorResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (client?.address) {
      setAddress(client.address);
    }
  }, [client?.address]);

  const handleCreateClientGuarantor = async () => {
    if (!selectedLeadVendor) {
      toast.error('Por favor selecciona un lead primero');
      return;
    }

    try {
      setIsCreating(true);

      const payload: ClientGuarantorPayload = {
        createClient: {
          leadId: selectedLeadVendor.id,
          address: address
        },
        createGuarantor: {
          firstName: selectedLeadVendor.firstName,
          lastName: selectedLeadVendor.lastName,
          email: email,
          document: selectedLeadVendor.document,
          documentType: selectedLeadVendor.documentType,
          phone: selectedLeadVendor.phone,
          address: address
        },
        document: selectedLeadVendor.document
      };

      const result = await createClientGuarantor(payload);
      setCreationResult(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear cliente y garante');
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-4"
    >
      <div className="rounded border-l-2 border-green-600 bg-gray-50 p-4 dark:border-green-700 dark:bg-gray-900">
        <h3 className="text-base font-medium text-[#035c64] dark:text-slate-200">Cliente</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona o busca un lead/cliente para asociar a la venta
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="">
          <span className="text-muted-foreground text-sm">Cliente:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" className="w-full px-2">
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {selectedLeadVendor?.firstName || 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {leadsData?.map((lead: LeadsVendorItems) => (
                <DropdownMenuItem
                  key={lead.id}
                  className={cn(
                    'cursor-pointer text-xs',
                    selectedLeadVendor?.id === lead.id && 'bg-blue-50 dark:bg-blue-900'
                  )}
                  onSelect={() => setSelectedLeadVendor(lead)}
                >
                  <Building className="mr-2 h-3.5 w-3.5 text-blue-500" />
                  <span className="truncate text-sm">
                    {lead.firstName}&nbsp;-&nbsp;{lead.lastName}&nbsp;-&nbsp;{lead.document}
                  </span>
                  {selectedLeadVendor?.id === lead.id && (
                    <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={handleCreateClientGuarantor}
          disabled={isCreating}
          className="bg-gradient-to-r from-[#025864] to-[#00CA7C]"
        >
          {isCreating ? 'Creando...' : 'Crear Cliente y Garante'}
        </Button>
      </div>
      {(selectedLeadVendor || client) && (
        <div className="overflow-hidden rounded-md border bg-slate-50 dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{selectedLeadVendor?.firstName}</TableCell>
                <TableCell>{selectedLeadVendor?.lastName}</TableCell>
                <TableCell>{selectedLeadVendor?.document}</TableCell>
                <TableCell>{selectedLeadVendor?.phone}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    id="email"
                    className="bg-white dark:bg-gray-800"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    className="bg-white dark:bg-gray-800"
                    placeholder="Dirección"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {creationResult && (
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <h4 className="mb-2 font-medium text-green-800 dark:text-green-200">
                Resultado de creación:
              </h4>
              <pre className="text-sm text-green-700 dark:text-green-300">
                {JSON.stringify(creationResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
