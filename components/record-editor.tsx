"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { DailyHealthForm } from "@/components/daily-health-form";
import { EmptyState } from "@/components/empty-state";
import { ExchangeCard } from "@/components/exchange-card";
import { SummaryCard } from "@/components/summary-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateDailySummary,
  cloneRecord,
  createEmptyExchangeSession,
  createEmptyRecord,
  findRecordByDate,
  formatDisplayDate,
  formatMl,
  getTodayDate,
  sanitizeRecord,
} from "@/lib/capd";
import { DailyRecord, ExchangeSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCapdStore } from "@/store/capd-store";

function LoadingCard() {
  return <Card className="h-44 animate-pulse bg-white/60" />;
}

export function RecordEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydrated = useCapdStore((state) => state.hasHydrated);
  const records = useCapdStore((state) => state.records);
  const upsertRecord = useCapdStore((state) => state.upsertRecord);

  const initialDate = searchParams.get("date") ?? getTodayDate();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [draft, setDraft] = useState<DailyRecord>(() => createEmptyRecord(initialDate));
  const [saveMessage, setSaveMessage] = useState("");

  const existingRecord = useMemo(() => findRecordByDate(records, selectedDate), [records, selectedDate]);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const nextRecord = existingRecord ? cloneRecord(existingRecord) : createEmptyRecord(selectedDate);
    setDraft(nextRecord);
    setSaveMessage("");
  }, [existingRecord, hasHydrated, selectedDate]);

  const summary = calculateDailySummary(draft);

  const updateSession = (id: string, patch: Partial<ExchangeSession>) => {
    setDraft((current) => ({
      ...current,
      exchangeSessions: current.exchangeSessions.map((session) => (session.id === id ? { ...session, ...patch } : session)),
    }));
  };

  const addSession = () => {
    setDraft((current) => ({
      ...current,
      exchangeSessions: [...current.exchangeSessions, createEmptyExchangeSession(current.id)],
    }));
  };

  const removeSession = (id: string) => {
    setDraft((current) => ({
      ...current,
      exchangeSessions: current.exchangeSessions.filter((session) => session.id !== id),
    }));
  };

  const updateRecord = (patch: Partial<DailyRecord>) => {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    router.replace(`/record?date=${value}`);
  };

  const handleSave = () => {
    const cleaned = sanitizeRecord({
      ...draft,
      date: selectedDate,
    });

    upsertRecord(cleaned);
    setDraft(cloneRecord(cleaned));
    setSaveMessage("Catatan tersimpan di perangkat.");
    router.replace(`/record?date=${cleaned.date}`);
  };

  if (!hasHydrated) {
    return (
      <AppShell title="Catatan Harian" description="Isi sesi exchange dan data kesehatan dalam format notebook yang ringan untuk ponsel.">
        <LoadingCard />
        <LoadingCard />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Catatan Harian"
      description="Isi setiap sesi CAPD dan data kesehatan dalam satu halaman yang mudah dipakai setiap hari."
      actions={
        existingRecord ? (
          <Link href={`/records/${selectedDate}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Lihat detail
          </Link>
        ) : null
      }
    >
      <Card className="animate-fade-up">
        <CardContent className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <label htmlFor="tanggal" className="text-sm font-medium text-foreground">
              Tanggal
            </label>
            <input
              id="tanggal"
              type="date"
              value={selectedDate}
              onChange={(event) => handleDateChange(event.target.value)}
              className="flex h-12 w-full rounded-2xl border border-input bg-white/80 px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            />
          </div>

          <div className="rounded-2xl bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Tanggal dipilih</p>
            <p className="mt-2 font-serif text-2xl text-foreground">{formatDisplayDate(selectedDate)}</p>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="Total masuk" value={formatMl(summary.totalMasukHarian)} />
        <SummaryCard label="Total keluar" value={formatMl(summary.totalKeluarHarian)} />
        <SummaryCard label="Balance (+)" value={formatMl(summary.cumulativePlus)} tone="plus" />
        <SummaryCard label="Balance (-)" value={formatMl(summary.cumulativeMinus)} tone="minus" />
      </section>

      <section className="space-y-4">
        {draft.exchangeSessions.length === 0 ? (
          <EmptyState
            title="Belum ada sesi exchange"
            description="Tambahkan sesi pertama untuk mulai mencatat masuk, keluar, dan kondisi cairan."
            actions={
              <Button onClick={addSession} size="lg">
                Tambah exchange
              </Button>
            }
          />
        ) : (
          draft.exchangeSessions.map((session, index) => (
            <ExchangeCard
              key={session.id}
              index={index}
              session={session}
              onChange={updateSession}
              onRemove={removeSession}
              canRemove={draft.exchangeSessions.length > 1}
            />
          ))
        )}

        <Button variant="outline" size="lg" className="w-full" onClick={addSession}>
          Add Exchange
        </Button>
      </section>

      <DailyHealthForm record={draft} onChange={updateRecord} />

      {saveMessage ? (
        <Card className="animate-fade-up border-accent/20 bg-accent/10">
          <CardContent className="px-5 py-4 text-sm text-foreground">{saveMessage}</CardContent>
        </Card>
      ) : null}

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-4">
        <div className="pointer-events-auto rounded-[1.75rem] border border-white/90 bg-white/95 p-3 shadow-notebook backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Siap disimpan</p>
              <p className="text-sm text-muted-foreground">{summary.totalExchange} sesi tercatat</p>
            </div>
            <Button size="lg" className={cn("min-w-[9rem]")} onClick={handleSave}>
              Simpan catatan
            </Button>
          </div>
        </div>
      </div>
      <div className="h-28" />
    </AppShell>
  );
}
