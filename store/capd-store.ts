"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { demoRecords } from "@/lib/dummy-data";
import { DailyRecord } from "@/lib/types";
import { sortRecordsNewestFirst } from "@/lib/capd";

interface CapdState {
  hasHydrated: boolean;
  records: DailyRecord[];
  loadDemoData: () => void;
  upsertRecord: (record: DailyRecord) => void;
  deleteRecord: (date: string) => void;
  clearRecords: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useCapdStore = create<CapdState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      records: [],
      loadDemoData: () => {
        set({ records: sortRecordsNewestFirst(demoRecords.map((record) => ({ ...record, exchangeSessions: record.exchangeSessions.map((session) => ({ ...session })) }))) });
      },
      upsertRecord: (record) => {
        set((state) => {
          const withoutSameDate = state.records.filter((item) => item.date !== record.date);

          return {
            records: sortRecordsNewestFirst([...withoutSameDate, record]),
          };
        });
      },
      deleteRecord: (date) => {
        set((state) => ({
          records: state.records.filter((record) => record.date !== date),
        }));
      },
      clearRecords: () => {
        set({ records: [] });
      },
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "capd-daily-record",
      partialize: (state) => ({
        records: state.records,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
