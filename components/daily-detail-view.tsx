"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { BalanceBadge } from "@/components/balance-badge";
import { EmptyState } from "@/components/empty-state";
import { SummaryCard } from "@/components/summary-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDailySummary, findRecordByDate, formatBloodPressure, formatDisplayDate, formatKg, formatMl } from "@/lib/capd";
import { cn } from "@/lib/utils";
import { useCapdStore } from "@/store/capd-store";

export function DailyDetailView() {
  const params = useParams<{ date: string }>();
  const hasHydrated = useCapdStore((state) => state.hasHydrated);
  const records = useCapdStore((state) => state.records);
  const recordDate = params.date;
  const record = findRecordByDate(records, recordDate);

  if (!hasHydrated) {
    return (
      <AppShell title="Detail Harian" description="Lihat ringkasan lengkap pertukaran, balance, dan data kesehatan per tanggal.">
        <Card className="h-44 animate-pulse bg-white/60" />
      </AppShell>
    );
  }

  if (!record) {
    return (
      <AppShell title="Detail Harian" description="Lihat ringkasan lengkap pertukaran, balance, dan data kesehatan per tanggal.">
        <EmptyState
          title="Catatan tidak ditemukan"
          description="Belum ada data untuk tanggal ini. Buat catatan baru untuk mulai mengisi notebook digital."
          actions={
            <Link href={`/record?date=${recordDate}`} className={buttonVariants({ variant: "default", size: "lg" })}>
              Buat catatan
            </Link>
          }
        />
      </AppShell>
    );
  }

  const summary = calculateDailySummary(record);

  return (
    <AppShell
      title={formatDisplayDate(record.date)}
      description="Ringkasan lengkap satu hari CAPD: total cairan, balance, sesi exchange, dan catatan kesehatan."
      actions={
        <Link href={`/record?date=${record.date}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Edit
        </Link>
      }
    >
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="Total masuk" value={formatMl(summary.totalMasukHarian)} />
        <SummaryCard label="Total keluar" value={formatMl(summary.totalKeluarHarian)} />
        <SummaryCard label="Balance (+)" value={formatMl(summary.cumulativePlus)} tone="plus" />
        <SummaryCard label="Balance (-)" value={formatMl(summary.cumulativeMinus)} tone="minus" />
      </section>

      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Daftar exchange</CardTitle>
          <CardDescription>{summary.totalExchange} sesi tercatat pada hari ini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {record.exchangeSessions.map((session, index) => (
            <div key={session.id} className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Exchange {index + 1}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{session.konsentratPercent}</p>
                </div>
                <BalanceBadge session={session} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Masuk</p>
                  <p className="font-semibold text-foreground">{formatMl(session.volumeMasukMl ?? 0)}</p>
                  <p className="text-muted-foreground">{session.jamMasukMulai || "-"} s/d {session.jamMasukSelesai || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Keluar</p>
                  <p className="font-semibold text-foreground">{formatMl(session.volumeKeluarMl ?? 0)}</p>
                  <p className="text-muted-foreground">{session.jamKeluarMulai || "-"} s/d {session.jamKeluarSelesai || "-"}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-2xl bg-white/70 p-3">
                  <p className="text-muted-foreground">Warna cairan</p>
                  <p className="font-medium text-foreground">{session.warnaCairan || "-"}</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3">
                  <p className="text-muted-foreground">Catatan sesi</p>
                  <p className="font-medium text-foreground">{session.catatanSesi || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Data kesehatan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Diuresis</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {record.diuresis24JamMl !== null && record.diuresis24JamMl !== undefined ? formatMl(record.diuresis24JamMl) : "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Tekanan darah</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatBloodPressure(record.tekananDarahSistolik, record.tekananDarahDiastolik)}
            </p>
          </div>
          <div className="rounded-2xl bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Berat badan</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {record.beratBadanKg !== null && record.beratBadanKg !== undefined ? formatKg(record.beratBadanKg) : "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Exit site</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{record.exitSiteStatus || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className={cn("animate-fade-up", !record.catatanHarian && "opacity-80")}>
        <CardHeader>
          <CardTitle>Catatan</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-foreground">{record.catatanHarian || "Tidak ada catatan tambahan."}</CardContent>
      </Card>
    </AppShell>
  );
}
