# ⚡ Logfolio — Frontend Client

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vanilla CSS](https://img.shields.io/badge/Style-Glassmorphism_Tokens-F59E0B?style=for-the-badge&logo=css3&logoColor=white)](src/index.css)

<p align="center">
  <b>Antarmuka pengguna modern berbasis Glassmorphism untuk pembuatan portofolio micro-journaling otomatis.</b>
</p>

</div>

---

## 🏗️ Struktur Arsitektur Modul

Kode frontend diorganisasi dengan arsitektur berbasis fitur (*feature-driven modular architecture*):

```
client/src/
├── assets/                  # Aset statis & logo
├── components/
│   ├── common/              # Navbar, tombol, alert, feedback umum
│   └── modals/              # ContactModal, ExportModal, SharePortfolioModal, AiDigestModal
├── features/
│   ├── dashboard/           # QuickLogComposer, RecruiterInboxCard, ManageLogsTable
│   └── portfolio/           # BentoHero, RecruiterSnapshot, LogTimeline, ProjectShowcase
├── hooks/                   # usePortfolioData (State layer tunggal terpusat)
├── pages/                   # DashboardPage, PublicPortfolioPage
├── services/                # API Client (REST v1) & GitHub commit fetcher
├── types/                   # Definisi interface TypeScript terpusat
└── utils/                   # Engine Ekspor Resume PDF/A4, Markdown, JSON & Router
```

---

## 🛠️ Perintah Pengembangan

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite dev server lokal pada `http://localhost:5173` |
| `npm run build` | Menjalankan type-check (`tsc -b`) dan kompilasi produksi ke folder `dist/` |
| `npm run preview` | Meninjau hasil kompilasi produksi secara lokal |

---

## 🐳 Eksekusi Docker

Frontend dikemas menggunakan Nginx Alpine untuk efisiensi produksi maksimal:
```bash
# Menjalankan container frontend mandiri
docker compose up -d client

# Menyalin build terbaru langsung ke container Nginx
npm run build
docker cp dist/. logfolio_client:/usr/share/nginx/html/
```

---

## 🎨 Token Desain & UI/UX

Sistem visual diatur secara ketat melalui CSS Variables di [`src/index.css`](src/index.css):
- **Warna Aksen**: `var(--accent-primary)` (Indigo), `var(--accent-cyan)` (Cyan), `var(--accent-emerald)` (Emerald).
- **Latar Belakang**: `var(--bg-base)` (#0B0F17), `var(--bg-surface)` (#111827), `var(--bg-surface-elevated)` (#1F2937).
- **Format Cetak Khusus**: Didukung oleh `@media print` untuk menghasilkan resume satu halaman/dua halaman standar ATS tanpa elemen navigasi website.
