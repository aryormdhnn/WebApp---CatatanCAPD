import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDailySummary, formatDisplayDate, formatMl } from "@/lib/capd";
import { DailyRecord } from "@/lib/types";

interface RecordListItemProps {
  record: DailyRecord;
}

export function RecordListItem({ record }: RecordListItemProps) {
  const summary = calculateDailySummary(record);

  return (
    <Link href={`/records/${record.date}`} className="block">
      <Card className="animate-fade-up transition-transform hover:-translate-y-0.5">
        <CardContent className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Catatan harian</p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">{formatDisplayDate(record.date)}</h3>
            </div>
            <Badge className="border border-accent/20 bg-accent/10 text-accent">{summary.totalExchange} sesi</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-background/80 p-3">
              <p className="text-muted-foreground">Total masuk</p>
              <p className="mt-1 font-semibold text-foreground">{formatMl(summary.totalMasukHarian)}</p>
            </div>
            <div className="rounded-2xl bg-background/80 p-3">
              <p className="text-muted-foreground">Total keluar</p>
              <p className="mt-1 font-semibold text-foreground">{formatMl(summary.totalKeluarHarian)}</p>
            </div>
            <div className="rounded-2xl bg-plus/10 p-3">
              <p className="text-plus">Balance (+)</p>
              <p className="mt-1 font-semibold text-plus">{formatMl(summary.cumulativePlus)}</p>
            </div>
            <div className="rounded-2xl bg-minus/10 p-3">
              <p className="text-minus">Balance (-)</p>
              <p className="mt-1 font-semibold text-minus">{formatMl(summary.cumulativeMinus)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
