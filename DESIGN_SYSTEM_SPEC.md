# 🎨 PANDUAN SISTEM DESAIN & UI/UX (DESIGN SPEC v1.1)
> **Produk:** Logfolio / SkillProof  
> **Konsep:** *Micro-Journaling & Proof-of-Skill Portfolio Generator*  
> **Standar Estetika:** *Modern Sleek Developer-First (Linear / Raycast Style)*  

---

## 📑 Daftar Isi
1. [Arah Visual & Filosofi Desain](#1-arah-visual--filosofi-desain)
2. [Token Warna (Color Palette)](#2-token-warna-color-palette)
3. [Tipografi & Hirarki Teks](#3-tipografi--hirarki-teks)
4. [Ukuran, Jarak, & Efek Glassmorphism](#4-ukuran-jarak--efek-glassmorphism)
5. [Anatomi Komponen Antarmuka](#5-anatomi-komponen-antarmuka)
6. [Tata Letak & Wireframe Layar](#6-tata-letak--wireframe-layar)
7. [Aturan Tampilan Cetak (Print / PDF Resume)](#7-aturan-tampilan-cetak-print--pdf-resume)

---

## 1. Arah Visual & Filosofi Desain

Aplikasi ini menggunakan pendekatan **"Zero Fluff, High Utility"**:
* **Developer-Native:** Menggunakan tema dasar gelap (*Dark Mode*) berkelas tinggi yang sangat disukai komunitas teknologi, dipadukan dengan aksen warna neon yang halus (*subtle glow*).
* **Keterbacaan Cepat:** Hirarki kontras tinggi memastikan rekruter dapat menyerap profil kandidat dalam **6–10 detik**.
* **Mikro-Interaksi Halus:** Efek hover lembut, transisi tombol (150ms–200ms), dan kartu semi-transparan dengan blur latar belakang (*glassmorphism*).

---

## 2. Token Warna (Color Palette)

Semua warna dirancang harmonis dengan rasio kontras WCAG AAA untuk kenyamanan mata.

### 2.1 Warna Dasar & Latar (Backgrounds)
| Variabel Token | Kode Hex | Contoh Preview Visual | Peruntukan Elemen |
| :--- | :---: | :---: | :--- |
| `--bg-base` | `#0B0F17` | ⬛ Obsidian Gelap | Latar belakang canvas utama aplikasi |
| `--bg-surface` | `#111827` | ⬛ Slate Malam | Latar kartu, container form, & bilah navigasi |
| `--bg-surface-hover` | `#1F2937` | ⬛ Slate Terang | Status kartu saat disentuh kursor (*hover card*) |
| `--border-subtle` | `rgba(255,255,255,0.08)` | ▫️ Garis Tipis | Garis pembatas kartu & pemisah seksi |
| `--border-focus` | `rgba(99,102,241,0.50)` | 🟪 Glow Ungu | Garis tepi saat kolom input aktif/diketik |

### 2.2 Warna Teks (Typography Colors)
| Variabel Token | Kode Hex | Peruntukan Elemen |
| :--- | :---: | :--- |
| `--text-primary` | `#F9FAFB` | Judul utama (*headings*), nama, dan catatan penting |
| `--text-secondary` | `#9CA3AF` | Teks pendukung, bio ringkas, deskripsi proyek |
| `--text-muted` | `#6B7280` | Label tanggal, counter karakter, placeholder form |

### 2.3 Warna Aksen Status (Semantic Accents)
| Variabel Token | Kode Hex | Nuansa | Peruntukan Elemen |
| :--- | :---: | :---: | :--- |
| `--accent-primary` | `#6366F1` | 🟪 Indigo | Tombol aksi utama (*Publish*), tab aktif |
| `--accent-cyan` | `#06B6D4` | 🟦 Cyan | Lencana tautan terverifikasi (*Verified Proof*) |
| `--accent-emerald` | `#10B981` | 🟩 Emerald | Matriks konsistensi (*Heatmap*) & Streak aktif |
| `--accent-amber` | `#F59E0B` | 🟧 Amber | Bintang penanda *Featured Highlight* & Kudos |
| `--danger` | `#EF4444` | 🟥 Rose Red | Tombol hapus, alert error, form batalkan |

---

## 3. Tipografi & Hirarki Teks

Menggunakan font modern dari **Google Fonts**:

```
1. Font Antarmuka (UI & Judul): "Plus Jakarta Sans" atau "Inter", sans-serif
   ├── H1 / Hero Name   : 32px | Bold (700)      | Spacing: -0.02em
   ├── H2 / Section     : 20px | SemiBold (600)  | Spacing: -0.01em
   ├── Body Regular     : 14px | Regular (400)   | Line-Height: 1.6
   └── Caption / Small  : 12px | Medium (500)    | Line-Height: 1.4

2. Font Data Teknis & Metrik: "JetBrains Mono", monospace
   ├── Skill Tags (#tag): 12px | Medium (500)    | Background: rgba(255,255,255,0.05)
   ├── Metrik Streak    : 14px | Bold (700)      | Indikator angka konsistensi
   └── Link Bukti       : 12px | Regular (400)   | Monospace URL preview
```

---

## 4. Ukuran, Jarak, & Efek Glassmorphism

### 4.1 Kelengkungan Sudut (Border Radius)
* **Tag Keahlian & Status Badge:** `6px`
* **Tombol Interaktif & Input Box:** `8px`
* **Kartu Proyek & Wadah Quick-Log:** `14px`
* **Modal Dialog & Image Viewer:** `20px`

### 4.2 Efek Kaca & Elevasi (Glassmorphism)
```css
/* Styling Kartu Standar */
.card-glass {
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-glass:hover {
  background: rgba(31, 41, 55, 0.85);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}
```

---

## 5. Anatomi Komponen Antarmuka

### 5.1 Komponen Quick-Log Composer (Formulir 1–2 Menit)
* **Pilihan Proyek:** Dropdown ringkas dengan ikon gembok untuk opsi *Stealth NDA*.
* **Area Teks Catatan:** Maksimal 300 karakter dengan penghitung (*counter*) real-time.
* **Skill Tags Selector:** Input pintar berbasis enter atau klik rekomendasi (contoh: `#react`, `#docker`).
* **Bukti Kerja:** Kolom input URL otomatis (*auto-unfurl*) + tombol upload screenshot (otomatis WebP kompresi).
* **Aksi:** Tombol *Publish Log* (`#6366F1`) + Toggle *Mark as Featured Highlight* (⭐).

### 5.2 Komponen Recruiter Executive Snapshot (Kartu 10-Detik)
Terdiri dari 3 kartu sorotan ringkas di bagian paling atas portofolio:
```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│ 🔥 KONSISTENSI AKTIF    │  │ 🛠️ TOP 3 KEAHLIAN       │  │ ⭐ HIGHLIGHT UTAMA      │
│ 48 Hari Beruntun        │  │ #PostgreSQL (32 logs)   │  │ 1. Optimasi Query DB    │
│ 120 Total Catatan Kerja │  │ #Go (28 logs)           │  │ 2. Microservice OAuth   │
│ Bebas Hari Bolong       │  │ #TypeScript (24 logs)   │  │ 3. Docker Optimization  │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

### 5.3 Komponen Activity Heatmap
* Grid matriks 7 baris (hari dalam seminggu) × 52 kolom (minggu dalam setahun).
* Skala warna Emerald:
  * Intensitas 0 (Kosong): `#161E2E`
  * Intensitas 1 (1 log): `#064E3B`
  * Intensitas 2 (2 log): `#059669`
  * Intensitas 3 (3 log): `#10B981` (Maksimal harian)

---

## 6. Tata Letak & Wireframe Layar

### 6.1 Dashboard Internal Pengguna
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo] LOGFOLIO                      🔥 Streak: 14 Hari   [@Username] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ FORMULIR QUICK-LOG (1-2 MENIT) ]                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Proyek: [ E-Commerce Core v ]      [ ] Stealth Mode (NDA)        │  │
│  │ ──────────────────────────────────────────────────────────────── │  │
│  │ "Mengoptimasi query agregasi PostgreSQL, memangkas latency dari  │  │
│  │  450ms menjadi 35ms. Telah diuji dengan 10k concurrent users."   │  │
│  │                                                                  │  │
│  │ Skill Tags : [ #postgresql ✕ ] [ #sql ✕ ] [ + Tambah Tag ]       │  │
│  │ Tautan Bukti: [ https://github.com/.../pull/124    [✓ Terverifikasi]│
│  │ Unggah Gambar: [ 📷 screenshot-benchmark.webp (84 KB) ✕ ]        │  │
│  │                                                                  │  │
│  │ [★ Jadikan Highlight]                 Sisa: 142/300 Karakter     │  │
│  │                                       [ Simpan Catatan Harian ]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [ RIWAYAT AKTIVITAS & KALENDER STREAK ]                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Heatmap: [■■■■■□■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■]  │  │
│  │ Streak Freeze Aktif: 2/2 Tersedia    Zona Waktu: Asia/Jakarta    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Portofolio Publik Rekruter (`/p/:username`)
```
┌────────────────────────────────────────────────────────────────────────┐
│  [Foto]  Alex Pratama · Senior Backend Engineer                        │
│          "Membangun arsitektur terdistribusi & payment gateway API."   │
│          📍 Jakarta, Indonesia · [GitHub] [LinkedIn] [Website]         │
│                                                                        │
│          [ ✉️ Kirim Pesan Rekruter ]    [ 📄 Simpan Format Resume PDF ]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  TIER 1: RECRUITER EXECUTIVE SNAPSHOT (SCREENING 6-10 DETIK)          │
│  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐  │
│  │ 🔥 48 Hari Streak │  │ 🛠️ Top Keahlian   │  │ ⭐ 3 Highlight     │  │
│  │ 120 Total Bukti   │  │ PostgreSQL, Go, TS│  │ DB Query, CI/CD... │  │
│  └───────────────────┘  └───────────────────┘  └────────────────────┘  │
│                                                                        │
│  PROYEK UTAMA (WORKSTREAMS)                                            │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │ 🔒 Payment Gateway Engine    │    │ 🌐 OpenSource Portfolio Web  │  │
│  │ [Stealth NDA - Fintech Tier1]│    │ Next.js, PostgreSQL, RLS    │  │
│  │ 18 Catatan Progres Teruji    │    │ 24 Catatan Progres Teruji    │  │
│  └──────────────────────────────┘    └──────────────────────────────┘  │
│                                                                        │
│  TIER 2: LOGBOOK PEMBUKTIAN KERJA (PROOF-OF-WORK TIMELINE)             │
│  Saring Berdasarkan: [ Semua Proyek v ]   [ Semua Skill Tags v ]       │
│                                                                        │
│  • 16 Sep 2026  #PostgreSQL #Performance                              │
│    "Mengoptimasi query agregasi PostgreSQL, memangkas latency..."      │
│    Bukti Terverifikasi: [ github.com/.../pull/124 ↗ ] [ 📷 Lihat Bukti]│
│    Apresiasi: [ 👏 12 Kudos ]                                          │
│                                                                        │
│  • 15 Sep 2026  #Docker #DevOps                                       │
│    "Konfigurasi multi-stage build container, ukuran terpangkas 70%."   │
│    Bukti Terverifikasi: [ hub.docker.com/... ↗ ]                       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  Footer: [Laporkan Profil / DMCA] · Ditenagai oleh Logfolio            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Aturan Tampilan Cetak (Print / PDF Resume)

Ketika rekruter atau kandidat menekan tombol **"Simpan Format Resume PDF"** (atau `Ctrl + P`), CSS `@media print` akan otomatis mengaktifkan penataan berikut:
1. **Latar Belakang:** Berubah otomatis menjadi putih murni (`#FFFFFF`) dan teks menjadi hitam pekat (`#111827`) untuk hasil cetak bersih dan hemat tinta.
2. **Elemen yang Disembunyikan:**
   * Tombol navigasi, tombol Kudos, tombol form pesan, dan footer pelaporan.
3. **Format Halaman:** Ukuran standar kertas A4, margin keliling `1.5 cm`, dengan pemisahan seksi yang proporsional (*avoid page-break inside card*).

---
*Dokumen ini menjadi standar visual baku untuk pengkodean antarmuka web Logfolio.*
