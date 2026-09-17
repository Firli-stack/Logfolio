# DOKUMEN PERANCANGAN SISTEM (SRS & PRD v2.2)
## Micro-Journaling & Proof-of-Skill Portfolio Generator
**Nama Produk (Tentatif):** Logfolio / SkillProof  
**Versi Dokumen:** 2.2 (Bulletproof Edition: Full Architecture, Security Hardening, & Long-Term Risk Mitigations)  
**Status:** Approved for Implementation  

---

## 1. Ringkasan Eksekutif & Konsep Produk

### 1.1 Deskripsi Produk
**Logfolio** adalah platform web *micro-journaling* berbasis bukti (*proof-of-work*) yang secara otomatis mengonversi kebiasaan mencatat harian (1–2 menit per hari) menjadi halaman portofolio interaktif, modern, dan terverifikasi untuk memikat para perekrut (*recruiters*) dan calon klien.

### 1.2 Latar Belakang & Problem Statement
* **Masalah Sisi Kandidat:** Portofolio tradisional statis, cepat usang, dan menyita banyak waktu. Pengembang sering terikat NDA (tidak boleh share kode internal), takut burnout saat streak terputus, khawatir zona waktu merusak hitungan streak, dan takut data catatan tahunan mereka terkunci tanpa bisa diekspor.
* **Masalah Sisi Rekruter:** Rekruter hanya punya waktu 6–10 detik untuk screening awal. Tautan bukti sering rusak (404), dan halaman portofolio sering berantakan tanpa kurasi. Rekruter juga butuh kontak instan tanpa resiko spam.
* **Solusi Logfolio:** Paradigma **"Log-First, Showcase-Second"** dengan **2-Tier Presentation** (Executive Snapshot 10-detik + Deep Filterable Logbook), *Stealth Mode* untuk proyek NDA, *Streak Freeze*, *Timezone-Aware Calculation*, kompresi aset otomatis, dan *Masked Contact Relay*.

### 1.3 Target Pengguna
1. **Software Engineers & Developers** (mencatat PR, fitur, bug fixing, arsitektur sistem).
2. **UI/UX & Product Designers** (mencatat user flow, wireframe, design system token, prototipe).
3. **Tech Students & Bootcamp Learners** (dokumentasi #100DaysOfCode atau materi belajar intensif).
4. **Indie Hackers & Tech Professionals** (membangun produk secara transparan / *build in public*).

---

## 2. Arsitektur Solusi & Alur Pengguna (User Flow)

```
[Pengguna / Job Seeker]
       │
       ▼ (1-2 Menit / Hari)
[Dashboard Quick-Log] ──► Input Terpandu (Micro-Templates): Teks (<300 char) + Proyek + Skill Tags
       │                  (Kompresi Gambar Otomatis WebP <150KB, Stealth NDA, Local Timezone)
       ▼
[Database Supabase + RLS] ──► Validasi Kualitas, Sanitasi Anti-XSS, Rate Limiting, View Agregasi
       │
       ▼
[Generator Engine] ───────► Agregasi 2-Tier Caching (ISR):
       │                   ├── Tier 1: Executive Snapshot (Top Skills, Proyek Utama, Streak)
       │                   └── Tier 2: Deep Logbook (Filterable Timeline & Proof Verification)
       ▼
[Halaman Publik: /p/:username] ◄── [Perekrut / Klien / Publik]
       │
       ├── Executive 10-Second Pitch
       ├── Project Cards (Termasuk Stealth Mode NDA)
       ├── Verified Proof-of-Work Timeline (Link Health Checked)
       ├── Masked Recruiter Contact Form (Anti-Spam Relay)
       ├── Report Profile / Abuse Trigger
       └── Export Friendly (Print to PDF Resume)
```

---

## 3. Kebutuhan Fungsional (Functional Requirements)

| Modul | Kode | Kebutuhan Fungsional | Prioritas | Detail & Kriteria Keberhasilan |
| :--- | :--- | :--- | :--- | :--- |
| **Autentikasi** | **FR-01** | Autentikasi Fleksibel & Aman | P1 (Must) | Pendaftaran dan login via Email/Password serta OAuth (GitHub & Google) dengan sesi JWT aman. |
| **Profil** | **FR-02** | Manajemen Profil & Identitas | P1 (Must) | Kelola nama lengkap, username unik, titel/headline profesional, bio ringkas, foto avatar, tautan medsos, dan preferensi zona waktu. |
| **Manajemen Proyek** | **FR-03** | Pengelompokan Berbasis Proyek (*Workstreams*) | P1 (Must) | Wadah proyek terstruktur. Setiap log harian dapat dikaitkan dengan proyek tertentu. |
| **Privasi & NDA** | **FR-04** | Mode Rahasia Proyek (*Stealth / Blind Mode*) | P1 (Must) | Opsi menyamarkan detail sensitif/nama klien untuk entri kerja di bawah NDA (contoh: *"Top Tier Bank Engine"*). |
| **Micro-Journaling** | **FR-05** | Input Cepat dengan Panduan (*Micro-Templates*) | P1 (Must) | Form pengisian ringkas (<300 karakter) dengan template petunjuk (*What I built*, *Challenges solved*) & batasan maks 3 log/hari agar tetap terkurasi rapi. |
| **Micro-Journaling** | **FR-06** | Penyematan Label Keahlian (*Skill Tags*) | P1 (Must) | Menyematkan 1 hingga 5 tag keahlian per log (contoh: `#nextjs`, `#typescript`, `#postgresql`). |
| **Micro-Journaling** | **FR-07** | Lampiran Bukti Nyata & Kompresi Gambar | P1 (Must) | Preview otomatis tautan bukti atau upload 1 gambar screenshot yang otomatis dikompresi di sisi klien menjadi WebP < 150KB. |
| **Micro-Journaling** | **FR-08** | Entri Historis (*Milestone Backfill*) | P1 (Must) | Boleh menginput pencapaian masa lalu (maks 30–90 hari lalu) dengan penanda jelas (*Historical Entry*) agar profil baru langsung siap pakai. |
| **Micro-Journaling** | **FR-09** | Highlight Unggulan (*Featured Logs*) | P1 (Must) | Menandai log pencapaian terbaik sebagai *Featured Highlight* untuk disorot di bagian atas portofolio. |
| **Micro-Journaling** | **FR-10** | Manajemen & Edit Log | P2 (Should) | Fitur sunting teks, ganti tag, atau hapus entri log milik sendiri. |
| **Generator Publik** | **FR-11** | URL Publik Unik (`/p/:username`) | P1 (Must) | Halaman portofolio publik tanpa login dengan performa instan dan desain visual premium. |
| **Generator Publik** | **FR-12** | Tampilan 2-Tier: *Recruiter Executive Snapshot* | P1 (Must) | Tampilan ringkasan 10-detik untuk rekruter: total hari konsisten, 3 keahlian teraktif, dan 3 kartu highlight utama sebelum masuk ke timeline detail. |
| **Generator Publik** | **FR-13** | Filter Interaktif & Riwayat Logbook | P1 (Must) | Filter dinamis logbook berdasarkan skill tags atau proyek, lengkap dengan status verifikasi bukti kerja. |
| **Generator Publik** | **FR-14** | Matriks Heatmap dengan Logika *Timezone-Aware* | P2 (Should) | Kalender aktivitas dan penghitungan streak dihitung berdasarkan zona waktu lokal browser pengguna (mencegah streak terputus akibat selisih UTC). |
| **Generator Publik** | **FR-15** | Verifikasi Tautan Bukti (*Link Health Check*) | P2 (Should) | Cek otomatis tautan bukti (HTTP 200) dengan lencana centang hijau (*Verified Proof*) untuk mencegah broken links. |
| **Generator Publik** | **FR-16** | Formulir Kontak Terproteksi (*Masked Contact Relay*) | P1 (Must) | Tombol kontak instan untuk rekruter tanpa mengekspos email/no HP pribadi kandidat ke publik (anti-scraping/spam). |
| **Generator Publik** | **FR-17** | Ekspor Ramah Cetak (*Print to PDF Resume*) | P2 (Should) | Tombol satu-klik cetak PDF dengan tata letak resume A4 yang bersih dan rapi. |
| **Retensi Pengguna** | **FR-18** | Mode Libur / Istirahat (*Streak Freeze*) | P2 (Should) | Jatah 1–2 kali pembekuan streak per bulan saat kandidat sakit atau cuti/liburan, mencegah *burnout*. |
| **Retensi Pengguna** | **FR-19** | Pengingat Harian (*Daily Streak Nudge*) | P2 (Should) | Notifikasi pengingat ramah via browser notification atau email ringkas bila belum mencatat log hingga pukul 20:00 waktu lokal. |
| **Portabilitas Data**| **FR-20** | Ekspor Seluruh Data Portofolio (*Data Portability*) | P2 (Should) | Pengguna dapat mengunduh seluruh riwayat catatan dan profil mereka dalam format JSON atau Markdown kapan saja (bebas vendor lock-in). |
| **Keamanan Publik** | **FR-21** | Pelaporan Pelanggaran Konten (*Report Profile / DMCA*) | P2 (Should) | Tombol pelaporan di footer publik untuk mencegah penyalahgunaan hosting, konten berhak cipta, atau konten terlarang. |
| **Social Proof** | **FR-22** | Reaksi Apresiasi (*Kudos / Clap*) | P3 (Could) | Perekrut atau pengunjung dapat memberikan apresiasi *Kudos* pada entri pencapaian tertentu. |
| **Automasi Developer**| **FR-23** | Integrasi Webhook GitHub (Opsional) | P3 (Could) | Menerima webhook commit/PR dari repositori GitHub publik untuk otomatis menghasilkan draf log harian. |

---

## 4. Kebutuhan Non-Fungsional & Mitigasi Risiko Jangka Panjang (NFR)

| Kategori | Kode | Spesifikasi Standar | Mitigasi Risiko & Penjelasan Teknis |
| :--- | :--- | :--- | :--- |
| **Performa & Caching** | **NFR-01** | *First Contentful Paint* (FCP) < 1.2 detik | Pemuatan halaman publik kilat dengan ISR (*Incremental Static Regeneration*) dan Query View SQL terindeks (mengeliminasi masalah Query N+1). |
| **Efisiensi Aset & Storage**| **NFR-02** | *Client-Side Image Compression* | Gambar screenshot wajib dikompresi di sisi browser pengguna menjadi format WebP resolusi maks 1200px dan ukuran < 150 KB sebelum diunggah ke storage. |
| **Presisi Zona Waktu** | **NFR-03** | *Timezone-Aware Date Boundary* | Perhitungan streak dan tanggal entri log mengikat offset zona waktu lokal browser pengguna (`Intl.DateTimeFormat().resolvedOptions().timeZone`), bukan jam UTC server. |
| **SEO & Sharing** | **NFR-04** | Dynamic Social OpenGraph Tags | Menghasilkan OpenGraph Meta Tags & gambar preview dinamis (nama, titel, streak, top skills) saat URL portofolio dibagikan di medsos. |
| **Responsivitas** | **NFR-05** | Multi-Device Responsive UI | Antarmuka adaptif dari layar smartphone (360px) hingga layar desktop ultra-wide dengan transisi halus dan tipografi modern. |
| **Keamanan Data** | **NFR-06** | *Row-Level Security* (RLS) PostgreSQL | Pembacaan publik hanya untuk data publik. Operasi tulis (insert/update/delete) dibatasi mutlak hanya untuk pemilik akun (`auth.uid() = user_id`). |
| **Integritas Input** | **NFR-07** | Reservasi & Validasi Username | Username divalidasi alfanumerik `^[a-z0-9_-]{3,30}$` serta memblokir nama sistemik (misal: `admin`, `api`, `login`, `root`, `settings`, `explore`). |
| **Keamanan Web** | **NFR-08** | Sanitasi Konten Ketat (Anti-XSS) | Teks bio, catatan log, dan deskripsi proyek wajib disanitasi menggunakan HTML sanitizer (DOMPurify) sebelum dirender ke halaman publik. |
| **Keamanan Jaringan**| **NFR-09** | Proteksi SSRF pada Metadata URL | Parser tautan bukti eksternal wajib melalui serverless proxy terisolasi dengan filter penolak IP intranet privat (RFC 1918: `127.0.0.1`, `10.0.0.0/8`, dll). |
| **Anti-Spam & Reputasi**| **NFR-10**| Proteksi SEO Poisoning & Spam Relay | 1. Halaman profil disetel `noindex, nofollow` sampai memiliki min. 3 entri log valid dan email terverifikasi.<br>2. Form kontak rekruter diproteksi honeypot + rate limiter per IP. |
| **Ketahanan Server** | **NFR-11** | API Rate Limiting | Membatasi endpoint submit log dan auth maksimal 10 request per menit per IP untuk menangkal spam bot dan brute-force. |
| **Akurasi Cetak** | **NFR-12** | *CSS Dedicated Print Stylesheet* | Memanfaatkan `@media print` murni untuk format cetak A4/Letter monokrom yang hemat tinta, menyembunyikan tombol UI interaktif, dan mempertahankan grafik. |

---

## 5. Perancangan Skema Basis Data Relasional (PostgreSQL / Supabase)

### 5.1 Entitas & Struktur Tabel

```sql
-- 1. TABEL PROFIL PENGGUNA
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(150),
    bio TEXT,
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',    -- Zona waktu pengguna (misal: Asia/Jakarta)
    social_links JSONB DEFAULT '{}'::jsonb, -- { github, linkedin, twitter, website }
    is_public BOOLEAN DEFAULT true,
    streak_freeze_count INT DEFAULT 2,      -- Jatah freeze streak per bulan
    last_active_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PROYEK (WORKSTREAMS)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    repo_url TEXT,
    live_url TEXT,
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'archived'
    is_stealth_nda BOOLEAN DEFAULT false,    -- Mode rahasia proyek NDA
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL LOG MIKRO-JURNAL
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    content VARCHAR(300) NOT NULL,
    proof_url TEXT,
    proof_image_url TEXT,
    is_proof_verified BOOLEAN DEFAULT false, -- Lencana link aktif (Health Check)
    is_featured BOOLEAN DEFAULT false,
    is_backfill BOOLEAN DEFAULT false,       -- Penanda entri historis
    kudos_count INT DEFAULT 0,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL SKILLS & LOG_SKILLS
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE log_skills (
    log_id UUID REFERENCES logs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (log_id, skill_id)
);

-- 5. TABEL CONTACT RELAY (PESAN DARI REKRUTER)
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recruiter_name VARCHAR(100) NOT NULL,
    recruiter_email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL LAPORAN KONTEN / ABUSE REPORT
CREATE TABLE profile_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_username VARCHAR(30) NOT NULL,
    reason VARCHAR(50) NOT NULL,            -- 'copyright', 'spam', 'nsfw', 'other'
    details TEXT,
    reporter_email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Optimasi Query Publik (SQL View Agregasi)
Untuk mengeliminasi masalah performa N+1 saat memuat profil publik, dibuat View berikut:
```sql
CREATE OR REPLACE VIEW public_portfolio_summary AS
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.headline,
    p.bio,
    p.avatar_url,
    p.social_links,
    p.timezone,
    COUNT(DISTINCT l.id) AS total_logs,
    COUNT(DISTINCT l.log_date) AS total_active_days,
    COALESCE(
        json_agg(DISTINCT jsonb_build_object(
            'id', pr.id,
            'title', pr.title,
            'status', pr.status,
            'is_stealth_nda', pr.is_stealth_nda,
            'is_featured', pr.is_featured
        )) FILTER (WHERE pr.id IS NOT NULL), '[]'
    ) AS projects_list
FROM profiles p
LEFT JOIN logs l ON p.id = l.user_id
LEFT JOIN projects pr ON p.id = pr.user_id
WHERE p.is_public = true
GROUP BY p.id;
```

---

## 6. Rencana Tahapan Eksekusi (Roadmap Implementasi)

* **Fase 1: Fondasi Arsitektur, Optimasi Asset & Database (Hari 1–3)**
  * Finalisasi PRD/SRS v2.2.
  * Inisialisasi proyek Next.js (App Router, TypeScript, Vanilla CSS Modules).
  * Setup tabel Supabase PostgreSQL lengkap dengan skema RLS & SQL View Agregasi.
* **Fase 2: Autentikasi & Dashboard Micro-Journaling (Hari 4–8)**
  * Integrasi Auth Supabase (Email, GitHub, Google OAuth).
  * Dashboard Quick-Log: Input dengan micro-templates, client-side WebP compression (<150KB), tagging, Stealth Mode, dan deteksi timezone browser.
  * Manajemen proyek dan sistem streak dengan jatah Streak Freeze & opsi Data Export (JSON/MD).
* **Fase 3: Generator Portofolio Publik & Fitur Rekruter (Hari 9–14)**
  * Halaman publik dinamis `/p/:username` (Recruiter Executive Snapshot, Activity Heatmap presisi timezone, filter proyek/skill).
  * Masked Contact Relay form untuk rekruter & tombol Report Profile.
* **Fase 4: Hardening, Ekspor Resume PDF, & Peluncuran (Hari 15–20)**
  * Penguatan keamanan: Anti-XSS sanitizer, SSRF defense, anti-spam SEO (`noindex` guard).
  * Dedicated Print CSS (`@media print`) untuk ekspor PDF instan.
  * Generator kartu OpenGraph dinamis untuk share LinkedIn/Twitter.
  * Deployment produksi ke Vercel & Supabase.

---
*Dokumen ini merupakan spesifikasi lengkap, tahan uji, dan menjadi acuan baku seluruh proses implementasi aplikasi.*
