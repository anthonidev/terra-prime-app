interface AmountBreakdownProps {
  total: number;
  paid: number;
  pending: number;
  currency: 'USD' | 'PEN';
}

export function AmountBreakdown({ total, paid, pending, currency }: AmountBreakdownProps) {
  const currencySymbol = currency === 'USD' ? '$' : 'S/';

  if (!total) return <span className="text-muted-foreground block text-center text-xs">-</span>;

  // Si está completamente pagado (paid >= total)
  const isCompleted = paid >= total;
  const hasPending = pending > 0;

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
          <div className="h-2 w-2 rounded-full bg-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-none font-semibold text-green-700">Completado</span>
          <span className="text-muted-foreground mt-0.5 text-[10px] leading-none">
            {currencySymbol} {paid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm leading-none font-semibold">
          {currencySymbol} {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-muted-foreground text-[10px] leading-none">total</span>
      </div>

      {paid > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
          <span className="text-[11px] leading-none text-blue-600">
            {currencySymbol} {paid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-muted-foreground text-[10px] leading-none">pagado</span>
        </div>
      )}

      {hasPending && (
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-orange-500" />
          <span className="text-[11px] leading-none text-orange-600">
            {currencySymbol} {pending.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-muted-foreground text-[10px] leading-none">pendiente</span>
        </div>
      )}
    </div>
  );
}
