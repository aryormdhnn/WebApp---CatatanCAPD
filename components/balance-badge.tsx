import { calculateSessionBalance } from "@/lib/capd";
import { ExchangeSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BalanceBadgeProps {
  session: Pick<ExchangeSession, "volumeMasukMl" | "volumeKeluarMl">;
}

export function BalanceBadge({ session }: BalanceBadgeProps) {
  const balance = calculateSessionBalance(session);
  const isPlus = balance.plus > 0;
  const isMinus = balance.minus > 0;
  const label = isPlus ? `+${balance.plus} ml` : isMinus ? `-${balance.minus} ml` : "0 ml";

  return (
    <Badge
      className={cn(
        "border",
        isPlus && "border-plus/20 bg-plus/10 text-plus",
        isMinus && "border-minus/20 bg-minus/10 text-minus",
        !isPlus && !isMinus && "border-border bg-white/70 text-muted-foreground",
      )}
    >
      Balance {label}
    </Badge>
  );
}
