import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryTone = "neutral" | "plus" | "minus" | "accent";

const toneStyles: Record<SummaryTone, string> = {
  neutral: "from-white to-white/80",
  plus: "from-plus/10 to-white",
  minus: "from-minus/10 to-white",
  accent: "from-accent/10 to-white",
};

const valueStyles: Record<SummaryTone, string> = {
  neutral: "text-foreground",
  plus: "text-plus",
  minus: "text-minus",
  accent: "text-accent",
};

interface SummaryCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: SummaryTone;
}

export function SummaryCard({ label, value, hint, tone = "neutral" }: SummaryCardProps) {
  return (
    <Card className={cn("bg-gradient-to-br animate-fade-up", toneStyles[tone])}>
      <CardContent className="space-y-1 px-5 py-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("text-2xl font-semibold tracking-tight", valueStyles[tone])}>{value}</p>
        {hint ? <p className="text-sm leading-6 text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
