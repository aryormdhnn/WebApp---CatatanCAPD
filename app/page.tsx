"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { RecordListItem } from "@/components/record-list-item";
import { SummaryCard } from "@/components/summary-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateDailySummary, findRecordByDate, formatBloodPressure, formatKg, formatMl, getTodayDate, sortRecordsNewestFirst } from "@/lib/capd";
import { useCapdStore } from "@/store/capd-store";

function LoadingCard() {
  return <Card className="h-36 animate-pulse bg-white/60" />;
}

export default function DashboardPage() {
  const hasHydrated = useCapdStore((state) => state.hasHydrated);
  const records = useCapdStore((state) => state.records);
  const loadDemoData = useCapdStore((state) => state.loadDemoData);

  const today = getTodayDate();
  const todayRecord = findRecordByDate(records, today);
  const summary = calculateDailySummary(todayRecord);
  const recentRecords = sortRecordsNewestFirst(records).slice(0, 5);

  if (!hasHydrated) {
    return (
      <AppShell title="Dashboard" description="Ringkasan CAPD hari ini dan akses cepat ke catatan terbaru.">
        <LoadingCard />
        <LoadingCard />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      description="Ringkasan hari ini menampilkan total cairan, balance, diuresis, tekanan darah, dan berat badan tanpa tampilan yang rumit."
      actions={
        <Link href={`/record?date=${today}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Isi hari ini
        </Link>
      }
    >
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="Total masuk" value={formatMl(summary.totalMasukHarian)} />
        <SummaryCard label="Total keluar" value={formatMl(summary.totalKeluarHarian)} />
        <SummaryCard label="Balance (+)" value={formatMl(summary.cumulativePlus)} tone="plus" />
        <SummaryCard label="Balance (-)" value={formatMl(summary.cumulativeMinus)} tone="minus" />
        <SummaryCard label="Diuresis" value={todayRecord?.diuresis24JamMl !== null && todayRecord?.diuresis24JamMl !== undefined ? formatMl(todayRecord.diuresis24JamMl) : "-"} tone="accent" />
        <SummaryCard
          label="Tekanan darah"
          value={formatBloodPressure(todayRecord?.tekananDarahSistolik ?? null, todayRecord?.tekananDarahDiastolik ?? null)}
        />
        <SummaryCard label="Berat badan" value={todayRecord?.beratBadanKg !== null && todayRecord?.beratBadanKg !== undefined ? formatKg(todayRecord.beratBadanKg) : "-"} />
        <SummaryCard label="Total exchange" value={`${summary.totalExchange} sesi`} hint={todayRecord ? "Data hari ini sudah tersedia." : "Belum ada sesi untuk hari ini."} />
      </section>

      {recentRecords.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="notebook-caption">Riwayat terbaru</p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">Catatan terakhir</h2>
            </div>
            <Link href="/history" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Lihat semua
            </Link>
          </div>
          {recentRecords.map((record) => (
            <RecordListItem key={record.id} record={record} />
          ))}
        </section>
      )}
    </AppShell>
  );
}
