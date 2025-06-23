import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyType, Voucher } from '@domain/entities/sales/payment.entity';
import { format } from 'date-fns';
import { Building, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface PaymentImagesSectionProps {
  images: Voucher[];
  onImageClick: (url: string) => void;
  currencyType: CurrencyType;
}

export default function PaymentImagesSection({
  images,
  onImageClick,
  currencyType
}: PaymentImagesSectionProps) {
  const formatCurrency = (amount: number, currency: CurrencyType = CurrencyType.PEN) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="text-primary h-5 w-5" />
          Comprobantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="hover:ring-primary/50 cursor-pointer overflow-hidden rounded-md border transition-all hover:ring-2"
                onClick={() => onImageClick(image.url)}
              >
                <div className="bg-muted relative h-36 w-full">
                  <Image
                    width={500}
                    height={500}
                    src={image.url}
                    alt={`Comprobante #${image.id}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="group absolute inset-0 flex items-center justify-center bg-black/0 transition-all hover:bg-black/30">
                    <div className="scale-90 transform opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                      <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 p-2 text-xs">
                  <div className="text-primary/70 mb-1 flex items-center gap-1">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <p className="truncate font-medium">{image.bankName || 'Banco'}</p>
                  </div>
                  <p className="truncate font-medium">{image.transactionReference}</p>
                  <div className="text-muted-foreground mt-1 flex justify-between">
                    <span>{formatCurrency(image.amount, currencyType)}</span>
                    <span>{format(new Date(image.transactionDate), 'dd/MM/yyyy')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-6 text-center">No hay comprobantes adjuntos</div>
        )}
      </CardContent>
    </Card>
  );
}
