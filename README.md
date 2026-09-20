# ⚡ Logfolio — Proof-of-Skill Portfolio Generator

<div align="center">

[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](docker-compose.yml)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](client/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](client/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](server/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](server/prisma/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](server/prisma/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Platform mikro-jurnal berbasis pembuktian kerja (proof-of-work) yang secara otomatis mengonversi kebiasaan mencatat harian (1–2 menit per hari) menjadi portofolio interaktif, modern, dan terverifikasi untuk rekruter.</b>
</p>

[✨ Fitur](#-fitur-unggulan) •
[🏛️ Arsitektur](#-arsitektur-sistem) •
[🚀 Mulai Cepat](#-panduan-instalasi--menjalankan) •
[⚙️ Konfigurasi](#-konfigurasi-environment-env) •
[📚 Dokumentasi](#-dokumentasi-proyek)

</div>

---

## ✨ Fitur Unggulan

| Modul Fitur | Deskripsi Fungsional | Status |
| :--- | :--- | :---: |
| ⚡ **Recruiter Executive Snapshot** | Ringkasan screening 10-detik: top skills, streak konsistensi, dan sorotan karya terbaik | ✅ Siap |
| 🛡️ **Stealth Mode (NDA Protection)** | Penyamaran otomatis tautan internal & nama klien untuk proyek di bawah perlindungan NDA | ✅ Siap |
| 🔄 **Live GitHub Auto-Sync** | Sinkronisasi riwayat commit real-time dari GitHub API langsung ke log composer | ✅ Siap |
| 📬 **Masked Contact Relay** | Form kontak rekruter anti-spam; alamat email kandidat terlindungi dari scraper bot | ✅ Siap |
| 📥 **Dashboard Recruiter Inbox** | Panel membaca dan membalas pesan rekruter secara instan langsung dari dashboard | ✅ Siap |
| 📄 **One-Click ATS & PDF Resume** | Ekspor format cetak khusus A4/PDF (`@media print`), Markdown, dan JSON dwibahasa | ✅ Siap |
| 📊 **Engineering Rhythm Heatmap** | Visualisasi aktivitas harian timezone-aware ala kontribusi commit GitHub | ✅ Siap |
| 🤖 **AI Summary & Weekly Digest** | Generator rangkuman performa mingguan otomatis dengan opsi bahasa ID / EN | ✅ Siap |

---

## 🏛️ Arsitektur Sistem

```mermaid
graph TD
    User([Pengguna / Rekruter]) -->|Port 5173| Client[Frontend: React 18 + Vite + Nginx]
    Client -->|REST API /api/v1| Server[Backend: Node.js + Express + Zod]
    Server -->|Prisma ORM| DB[(Database: PostgreSQL 16 Alpine)]
    Server -->|Sync Commit| GitHub[GitHub REST API v3]
```

### Topologi Port & Container
- **Frontend Client**: [http://localhost:5173](http://localhost:5173) (Container: `logfolio_client`)
- **Backend Server**: [http://localhost:5000](http://localhost:5000) (Container: `logfolio_server`)
- **PostgreSQL Database**: `localhost:5432` (Container: `logfolio_postgres`)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555) (Container: `logfolio_studio`)

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
- [Docker](https://www.docker.com/) & Docker Compose terpasang.
- Node.js v20+ & Git (opsional untuk pengembangan lokal non-container).

### 2. Menjalankan via Docker Compose (Rekomendasi)
```bash
# 1. Klon repositori
git clone https://github.com/Firli-stack/Logfolio.git
cd Logfolio

# 2. Jalankan seluruh container (postgres, server, client)
docker compose up -d

# 3. Masukkan data awal profil nyata (Firli-stack & Proyek ASA ERP)
docker exec logfolio_server npx tsx prisma/seed.ts
```

Aplikasi siap diakses di [http://localhost:5173](http://localhost:5173)!

---

## ⚙️ Konfigurasi Environment (`.env`)

Konfigurasi backend berada di `server/.env` atau `docker-compose.yml`:

| Variabel | Deskripsi | Default Value |
| :--- | :--- | :--- |
| `PORT` | Port server Express | `5000` |
| `NODE_ENV` | Lingkungan runtime (`development` / `production`) | `production` |
| `DATABASE_URL` | URL koneksi PostgreSQL Prisma | `postgresql://postgres:password123@postgres:5432/logfolio?schema=public` |
| `CLIENT_URL` | Domain frontend yang diizinkan CORS | `http://localhost:5173` |
| `JWT_SECRET` | Kunci rahasia hashing token autentikasi | `***REDACTED***` |

---

## 📚 Dokumentasi Proyek

| Dokumen | Lokasi | Cakupan Konten |
| :--- | :--- | :--- |
| **Spesifikasi PRD & SRS** | [`docs/PRD_SRS_Portfolio_Generator_v2.md`](docs/PRD_SRS_Portfolio_Generator_v2.md) | Spesifikasi kebutuhan fungsional (FR) & non-fungsional (NFR) lengkap |
| **Sistem Desain & UI/UX** | [`docs/DESIGN_SYSTEM_SPEC.md`](docs/DESIGN_SYSTEM_SPEC.md) | Token warna WCAG AAA, glassmorphism, tipografi, dan print stylesheet |
| **Panduan Frontend** | [`client/README.md`](client/README.md) | Arsitektur komponen modular, state management, dan styling |
| **Panduan Backend API** | [`server/README.md`](server/README.md) | Daftar endpoint REST `/api/v1`, skema validasi Zod, dan Prisma ORM |

---
