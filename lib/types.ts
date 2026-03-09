export const KONSENTRAT_OPTIONS = ["1.5%", "2.5%", "4.25%"] as const;

export type KonsentratPercent = (typeof KONSENTRAT_OPTIONS)[number];

export interface ExchangeSession {
  id: string;
  dailyRecordId: string;
  konsentratPercent: KonsentratPercent;
  volumeMasukMl: number | null;
  jamMasukMulai: string;
  jamMasukSelesai: string;
  volumeKeluarMl: number | null;
  jamKeluarMulai: string;
  jamKeluarSelesai: string;
  warnaCairan: string;
  catatanSesi: string;
}

export interface DailyRecord {
  id: string;
  date: string;
  diuresis24JamMl: number | null;
  tekananDarahSistolik: number | null;
  tekananDarahDiastolik: number | null;
  beratBadanKg: number | null;
  exitSiteStatus: string;
  catatanHarian: string;
  exchangeSessions: ExchangeSession[];
}

export interface SessionBalance {
  rawBalance: number;
  plus: number;
  minus: number;
}

export interface DailySummary {
  totalMasukHarian: number;
  totalKeluarHarian: number;
  cumulativePlus: number;
  cumulativeMinus: number;
  totalExchange: number;
}
