import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  received: {
    label: "Received",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  screening: {
    label: "Screening",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  screened: {
    label: "Screened",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  interview_ready: {
    label: "Interview Ready",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  error: {
    label: "Error",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
