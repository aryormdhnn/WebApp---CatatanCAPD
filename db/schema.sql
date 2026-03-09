CREATE TABLE daily_records (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  diuresis_24_jam_ml INTEGER,
  tekanan_darah_sistolik INTEGER,
  tekanan_darah_diastolik INTEGER,
  berat_badan_kg REAL,
  exit_site_status TEXT,
  catatan_harian TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exchange_sessions (
  id TEXT PRIMARY KEY,
  daily_record_id TEXT NOT NULL,
  konsentrat_percent TEXT NOT NULL CHECK (konsentrat_percent IN ('1.5%', '2.5%', '4.25%')),
  volume_masuk_ml INTEGER,
  jam_masuk TEXT,
  volume_keluar_ml INTEGER,
  jam_keluar TEXT,
  warna_cairan TEXT,
  catatan_sesi TEXT,
  urutan INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (daily_record_id) REFERENCES daily_records(id) ON DELETE CASCADE
);

CREATE INDEX idx_daily_records_date ON daily_records(date DESC);
CREATE INDEX idx_exchange_sessions_daily_record_id ON exchange_sessions(daily_record_id, urutan);
