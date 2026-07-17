import { cn } from "@/lib/utils";
import type { PaymentStatus, PropertyStatus } from "@/data/properties";
import { paymentStatusLabel, statusLabel } from "@/data/properties";

interface Props {
  status: PropertyStatus | PaymentStatus;
  className?: string;
}

const propertyStyles: Record<PropertyStatus, string> = {
  ocupado: "bg-success/15 text-success border border-success/25",
  disponivel: "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
  manutencao: "bg-info/15 text-info border border-info/25",
};

const paymentStyles: Record<PaymentStatus, string> = {
  em_dia: "bg-success/15 text-success border border-success/25",
  atrasado: "bg-destructive/15 text-destructive border border-destructive/25",
  pendente: "bg-warning/20 text-warning-foreground border border-warning/40 dark:text-warning",
};

function isProperty(status: string): status is PropertyStatus {
  return status === "ocupado" || status === "disponivel" || status === "manutencao";
}

export function StatusBadge({ status, className }: Props) {
  const style = isProperty(status)
    ? propertyStyles[status]
    : paymentStyles[status as PaymentStatus];
  const label = isProperty(status)
    ? statusLabel(status)
    : paymentStatusLabel(status as PaymentStatus);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
