"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { RecordListItem } from "@/components/record-list-item";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTodayDate, sortRecordsNewestFirst } from "@/lib/capd";
import { useCapdStore } from "@/store/capd-store";

export default function HistoryPage() {
  const hasHydrated = useCapdStore((state) => state.hasHydrated);
  const records = useCapdStore((state) => state.records);
  const sortedRecords = sortRecordsNewestFirst(records);

  if (!hasHydrated) {
    return (
      <AppShell title="Riwayat" description="Daftar catatan harian tersusun dari yang terbaru ke yang terlama.">
        <Card className="h-36 animate-pulse bg-white/60" />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Riwayat"
      description="Setiap kartu menampilkan tanggal, total masuk, total keluar, balance plus, dan balance minus."
      actions={
        <Link href={`/record?date=${getTodayDate()}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Catatan baru
        </Link>
      }
    >
      {sortedRecords.length === 0 ? (
        <EmptyState
          title="Riwayat masih kosong"
          description="Setelah Anda menyimpan catatan harian, daftar riwayat akan muncul di sini dengan urutan terbaru terlebih dahulu."
          actions={
            <Link href={`/record?date=${getTodayDate()}`} className={buttonVariants({ variant: "default", size: "lg" })}>
              Isi catatan pertama
            </Link>
          }
        />
      ) : (
        <section className="space-y-4">
          {sortedRecords.map((record) => (
            <RecordListItem key={record.id} record={record} />
          ))}
        </section>
      )}
    </AppShell>
  );
}
