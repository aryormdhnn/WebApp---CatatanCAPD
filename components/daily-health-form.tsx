import { DailyRecord } from "@/lib/types";
import { NumberInput } from "@/components/number-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DailyHealthFormProps {
  record: DailyRecord;
  onChange: (patch: Partial<DailyRecord>) => void;
}

export function DailyHealthForm({ record, onChange }: DailyHealthFormProps) {
  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle>Data kesehatan harian</CardTitle>
        <CardDescription>Catat status tubuh dan area exit site pada tanggal yang sama.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          id="diuresis"
          label="Diuresis 24 jam"
          placeholder="Contoh 900"
          suffix="ml"
          value={record.diuresis24JamMl}
          onChange={(value) => onChange({ diuresis24JamMl: value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            id="td-sistolik"
            label="Sistolik"
            placeholder="120"
            suffix="mmHg"
            value={record.tekananDarahSistolik}
            onChange={(value) => onChange({ tekananDarahSistolik: value })}
          />
          <NumberInput
            id="td-diastolik"
            label="Diastolik"
            placeholder="80"
            suffix="mmHg"
            value={record.tekananDarahDiastolik}
            onChange={(value) => onChange({ tekananDarahDiastolik: value })}
          />
        </div>

        <NumberInput
          id="berat-badan"
          label="Berat badan"
          placeholder="63.5"
          suffix="kg"
          step={0.1}
          value={record.beratBadanKg}
          onChange={(value) => onChange({ beratBadanKg: value })}
        />

        <div className="space-y-2">
          <Label htmlFor="exit-site">Status exit site</Label>
          <Input
            id="exit-site"
            placeholder="Contoh: kering, sedikit merah, ada sekret"
            value={record.exitSiteStatus}
            onChange={(event) => onChange({ exitSiteStatus: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="catatan-harian">Catatan harian</Label>
          <Textarea
            id="catatan-harian"
            placeholder="Keluhan, kondisi umum, atau hal penting hari ini."
            value={record.catatanHarian}
            onChange={(event) => onChange({ catatanHarian: event.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
