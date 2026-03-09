import { DailyRecord, DailySummary, ExchangeSession, SessionBalance } from "@/lib/types";

export function generateId(prefix: string) {
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${uuid}`;
}

export function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseLocalDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseLocalDate(date));
}

export function formatMl(value: number) {
  return `${value.toLocaleString("id-ID")} ml`;
}

export function formatKg(value: number) {
  return `${value.toLocaleString("id-ID", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })} kg`;
}

export function formatBloodPressure(sistolik: number | null, diastolik: number | null) {
  if (sistolik === null || diastolik === null) {
    return "-";
  }

  return `${sistolik}/${diastolik} mmHg`;
}

export function toNullableNumber(value: number | string | null | undefined) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function createEmptyExchangeSession(dailyRecordId: string): ExchangeSession {
  return {
    id: generateId("exchange"),
    dailyRecordId,
    konsentratPercent: "1.5%",
    volumeMasukMl: null,
    jamMasuk: "",
    volumeKeluarMl: null,
    jamKeluar: "",
    warnaCairan: "",
    catatanSesi: "",
  };
}

export function createEmptyRecord(date = getTodayDate()): DailyRecord {
  const recordId = generateId("record");

  return {
    id: recordId,
    date,
    diuresis24JamMl: null,
    tekananDarahSistolik: null,
    tekananDarahDiastolik: null,
    beratBadanKg: null,
    exitSiteStatus: "",
    catatanHarian: "",
    exchangeSessions: [createEmptyExchangeSession(recordId)],
  };
}

export function cloneRecord(record: DailyRecord): DailyRecord {
  return {
    ...record,
    exchangeSessions: record.exchangeSessions.map((session) => ({ ...session })),
  };
}

export function isSessionBlank(session: ExchangeSession) {
  return (
    session.volumeMasukMl === null &&
    session.jamMasuk === "" &&
    session.volumeKeluarMl === null &&
    session.jamKeluar === "" &&
    session.warnaCairan.trim() === "" &&
    session.catatanSesi.trim() === ""
  );
}

export function calculateSessionBalance(session: Pick<ExchangeSession, "volumeMasukMl" | "volumeKeluarMl">): SessionBalance {
  const masuk = session.volumeMasukMl ?? 0;
  const keluar = session.volumeKeluarMl ?? 0;
  const rawBalance = masuk - keluar;

  return {
    rawBalance,
    plus: rawBalance > 0 ? rawBalance : 0,
    minus: rawBalance < 0 ? Math.abs(rawBalance) : 0,
  };
}

export function calculateDailySummary(record: Pick<DailyRecord, "exchangeSessions"> | null | undefined): DailySummary {
  const sessions = record?.exchangeSessions.filter((session) => !isSessionBlank(session)) ?? [];

  return sessions.reduce<DailySummary>(
    (accumulator, session) => {
      const masuk = session.volumeMasukMl ?? 0;
      const keluar = session.volumeKeluarMl ?? 0;
      const balance = calculateSessionBalance(session);

      return {
        totalMasukHarian: accumulator.totalMasukHarian + masuk,
        totalKeluarHarian: accumulator.totalKeluarHarian + keluar,
        cumulativePlus: accumulator.cumulativePlus + balance.plus,
        cumulativeMinus: accumulator.cumulativeMinus + balance.minus,
        totalExchange: accumulator.totalExchange + 1,
      };
    },
    {
      totalMasukHarian: 0,
      totalKeluarHarian: 0,
      cumulativePlus: 0,
      cumulativeMinus: 0,
      totalExchange: 0,
    },
  );
}

export function sanitizeRecord(record: DailyRecord): DailyRecord {
  const cleanedSessions = record.exchangeSessions
    .map((session) => ({
      ...session,
      dailyRecordId: record.id,
      volumeMasukMl: toNullableNumber(session.volumeMasukMl),
      volumeKeluarMl: toNullableNumber(session.volumeKeluarMl),
      warnaCairan: session.warnaCairan.trim(),
      catatanSesi: session.catatanSesi.trim(),
    }))
    .filter((session) => !isSessionBlank(session));

  return {
    ...record,
    date: record.date,
    diuresis24JamMl: toNullableNumber(record.diuresis24JamMl),
    tekananDarahSistolik: toNullableNumber(record.tekananDarahSistolik),
    tekananDarahDiastolik: toNullableNumber(record.tekananDarahDiastolik),
    beratBadanKg: toNullableNumber(record.beratBadanKg),
    exitSiteStatus: record.exitSiteStatus.trim(),
    catatanHarian: record.catatanHarian.trim(),
    exchangeSessions: cleanedSessions,
  };
}

export function sortRecordsNewestFirst(records: DailyRecord[]) {
  return [...records].sort((left, right) => right.date.localeCompare(left.date));
}

export function findRecordByDate(records: DailyRecord[], date: string) {
  return records.find((record) => record.date === date);
}
