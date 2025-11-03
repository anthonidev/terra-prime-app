import { VendorsContainer } from '@/features/vendors/components/vendors-container';

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y visualiza todos los vendedores activos del sistema.
        </p>
      </div>

      <VendorsContainer />
    </div>
  );
}
