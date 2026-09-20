# 🚀 Logfolio Frontend Client

Frontend antarmuka pengguna untuk **Logfolio** (*Micro-Journaling & Proof-of-Skill Portfolio Generator*).

---

## 🛠️ Stack Teknologi
- **Framework**: React 18
- **Bahasa**: TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Vanilla CSS (Sistem Desain Glassmorphism kustom)
- **Icons**: Lucide React

---

## 📁 Struktur Direktori
```
client/src/
├── assets/          # Ikon dan aset statis
├── components/      # Komponen umum & modal interaktif
│   ├── common/      # Navbar, alert, tombol umum
│   └── modals/      # Modal kontak, export, edit profil, sync GitHub
├── features/        # Modul fitur fungsional
│   ├── dashboard/   # QuickLogComposer, RecruiterInboxCard, ManageLogsTable
│   └── portfolio/   # BentoHero, RecruiterSnapshot, LogTimeline, ProjectShowcase
├── hooks/           # Custom hooks (usePortfolioData)
├── pages/           # Tampilan halaman (DashboardPage, PublicPortfolioPage)
├── services/        # Service API client & integrasi GitHub
├── types/           # Definisi interface & tipe TypeScript
└── utils/           # Router, export PDF/Markdown/JSON, helpers
```

---

## 💻 Panduan Menjalankan

### Melalui Docker (Rekomendasi):
Frontend berjalan secara otomatis di port `5173` via Nginx container:
```bash
docker compose up -d client
```

### Melalui Mode Dev Lokal:
```bash
npm install
npm run dev
```

---

## 🎨 Standar Desain
Mengikuti panduan di `docs/DESIGN_SYSTEM_SPEC.md` dengan palet warna glassmorphism gelap, variabel CSS seragam, dan prinsip bebas TailwindCSS.
