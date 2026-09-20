# ⚡ Logfolio — Frontend Client

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vanilla CSS](https://img.shields.io/badge/Style-Glassmorphism_Tokens-F59E0B?style=for-the-badge&logo=css3&logoColor=white)](src/index.css)
[![Nginx](https://img.shields.io/badge/Deploy-Nginx_Alpine-009639?style=for-the-badge&logo=nginx&logoColor=white)](Dockerfile)

<p align="center">
  <b>Antarmuka pengguna modern berbasis Glassmorphism untuk pembuatan portofolio micro-journaling otomatis.</b>
</p>

[🏗️ Arsitektur](#️-struktur-arsitektur-modul) •
[🛠️ Perintah](#️-perintah-pengembangan) •
[🐳 Docker](#-eksekusi-docker) •
[🎨 Desain & Print](#-token-desain--uiux)

</div>

---

## 🏗️ Struktur Arsitektur Modul

Kode frontend diorganisasi dengan arsitektur modular berbasis domain fitur (*feature-driven architecture*):

```
client/src/
├── assets/                  # Aset statis, ikon, dan brand assets
├── components/
│   ├── common/              # Navbar, tombol aksi, alert feedback umum
│   └── modals/              # ContactModal, ExportModal, SharePortfolioModal, AiDigestModal
├── features/
│   ├── dashboard/           # QuickLogComposer, RecruiterInboxCard, ManageLogsTable
│   └── portfolio/           # BentoHero, RecruiterSnapshot, LogTimeline, ProjectShowcase
├── hooks/                   # usePortfolioData (Single-source-of-truth state layer)
├── pages/                   # DashboardPage, PublicPortfolioPage
├── services/                # API Client (REST v1) & GitHub API Commit Synchronizer
├── types/                   # Interface TypeScript (UserProfile, LogEntry, Project, RecruiterMessage)
└── utils/                   # Engine Ekspor ATS/PDF Resume, Markdown, JSON & Dynamic Router
```

---

## 🛠️ Perintah Pengembangan

| Perintah | Deskripsi Tindakan |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite dev server lokal pada `http://localhost:5173` |
| `npm run build` | Menjalankan validasi tipe (`tsc -b`) dan kompilasi produksi ke folder `dist/` |
| `npm run preview` | Meninjau hasil kompilasi produksi secara lokal dengan web server Vite |

---

## 🐳 Eksekusi Docker

Frontend dikemas menggunakan web server **Nginx Alpine** untuk performa tinggi dan konsumsi memori minimal:

```bash
# 1. Menjalankan container frontend mandiri
docker compose up -d client

# 2. Menyalin hasil build terbaru langsung ke container Nginx
npm run build
docker cp dist/. logfolio_client:/usr/share/nginx/html/
```

---

## 🎨 Token Desain & UI/UX

Sistem visual diatur secara konsisten menggunakan CSS Variables di [`src/index.css`](src/index.css):

| Kategori Token | CSS Variable | Nilai Default | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `--bg-base` | `#0B0F17` | Latar belakang canvas utama aplikasi |
| **Glass Surface** | `--bg-surface` | `#111827` | Latar panel kartu dan container modal |
| **Elevated Card** | `--bg-surface-elevated` | `#1F2937` | Hover state kartu dan baris inbox aktif |
| **Aksen Utama** | `--accent-primary` | `#6366F1` | Tombol CTA utama, badge aktif, tautan |
| **Verified Cyan** | `--accent-cyan` | `#06B6D4` | Lencana bukti terverifikasi (*proof-of-work*) |
| **Konsistensi** | `--accent-emerald` | `#10B981` | Heatmap aktivitas, indikator streak aktif |

### 📄 Format Cetak ATS Resume (`@media print`)
Dilengkapi stylesheet cetak khusus untuk merender resume A4/PDF bersih dan rapi:
- Otomatis menyembunyikan navigasi, tombol interaksi, dan elemen floating.
- Memformat tipografi dengan standar ATS-friendly berlatar belakang putih bersih untuk rekruter.
