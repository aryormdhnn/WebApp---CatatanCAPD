import { BalanceBadge } from "@/components/balance-badge";
import { NumberInput } from "@/components/number-input";
import { TimeInput } from "@/components/time-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KONSENTRAT_OPTIONS, ExchangeSession } from "@/lib/types";

interface ExchangeCardProps {
  index: number;
  session: ExchangeSession;
  onChange: (id: string, patch: Partial<ExchangeSession>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function ExchangeCard({ index, session, onChange, onRemove, canRemove }: ExchangeCardProps) {
  return (
    <Card className="animate-fade-up">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Exchange {index + 1}</p>
          <CardTitle className="mt-1 text-xl">Sesi dialisis</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <BalanceBadge session={session} />
          {canRemove ? (
            <Button variant="ghost" size="sm" onClick={() => onRemove(session.id)}>
              Hapus
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-5">
        <div className="space-y-2">
          <Label htmlFor={`konsentrat-${session.id}`}>Konsentrat</Label>
          <select
            id={`konsentrat-${session.id}`}
            className="flex h-12 w-full rounded-2xl border border-input bg-white/80 px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            value={session.konsentratPercent}
            onChange={(event) => onChange(session.id, { konsentratPercent: event.target.value as ExchangeSession["konsentratPercent"] })}
          >
            {KONSENTRAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
          <NumberInput
            id={`masuk-${session.id}`}
            label="Volume masuk"
            placeholder="2000"
            suffix="ml"
            value={session.volumeMasukMl}
            onChange={(value) => onChange(session.id, { volumeMasukMl: value })}
          />
          <TimeInput
            id={`jam-masuk-mulai-${session.id}`}
            label="Mulai masuk"
            value={session.jamMasukMulai}
            onChange={(value) => onChange(session.id, { jamMasukMulai: value })}
          />
          <TimeInput
            id={`jam-masuk-selesai-${session.id}`}
            label="Selesai masuk"
            value={session.jamMasukSelesai}
            onChange={(value) => onChange(session.id, { jamMasukSelesai: value })}
          />
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
          <NumberInput
            id={`keluar-${session.id}`}
            label="Volume keluar"
            placeholder="1800"
            suffix="ml"
            value={session.volumeKeluarMl}
            onChange={(value) => onChange(session.id, { volumeKeluarMl: value })}
          />
          <TimeInput
            id={`jam-keluar-mulai-${session.id}`}
            label="Mulai keluar"
            value={session.jamKeluarMulai}
            onChange={(value) => onChange(session.id, { jamKeluarMulai: value })}
          />
          <TimeInput
            id={`jam-keluar-selesai-${session.id}`}
            label="Selesai keluar"
            value={session.jamKeluarSelesai}
            onChange={(value) => onChange(session.id, { jamKeluarSelesai: value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`warna-${session.id}`}>Warna cairan</Label>
          <Input
            id={`warna-${session.id}`}
            placeholder="Contoh: jernih"
            value={session.warnaCairan}
            onChange={(event) => onChange(session.id, { warnaCairan: event.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
