// ============================================================
// HOOK: useRegisterPayment - Registrar pago en una venta
// ============================================================
// Permite al vendedor (VEN) registrar pagos con comprobantes.
// Se usa tanto desde el listado como desde el detalle de venta.
// ============================================================

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner'; // Reemplazar con tu sistema de notificaciones
import { registerPayment } from '../lib/mutations';

export function useRegisterPayment(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof registerPayment>[1]) => registerPayment(saleId, data),
    onSuccess: () => {
      // Invalidar cache del detalle para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      toast.success('Pago registrado exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al registrar el pago';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error registering payment:', error);
    },
  });
}

// ---- EJEMPLO DE USO ----
//
// function PaymentForm({ saleId }: { saleId: string }) {
//   const { mutateAsync: registerPaymentMutation, isPending } = useRegisterPayment(saleId);
//
//   async function handleSubmit() {
//     const file = document.getElementById('voucher-file').files[0];
//
//     await registerPaymentMutation({
//       payments: [
//         {
//           bankName: 'BCP',
//           transactionReference: 'REF-001',
//           transactionDate: '2024-01-15',
//           amount: 5000,
//           codeOperation: 'OP-12345',
//           fileIndex: 0, // Indice del archivo en el array de files
//         },
//       ],
//       files: [file], // Array de archivos File
//     });
//   }
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" id="voucher-file" />
//       <button disabled={isPending}>
//         {isPending ? 'Registrando...' : 'Registrar Pago'}
//       </button>
//     </form>
//   );
// }
