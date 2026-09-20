# ⚙️ Logfolio — Backend REST API Server

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Zod](https://img.shields.io/badge/Validation-Zod_3.23-3068B7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev)

<p align="center">
  <b>Backend REST API engine tangguh dengan validasi ketat Zod, ORM Prisma, dan proteksi anti-spam rate limiting.</b>
</p>

[📡 API Endpoints](#-daftar-endpoint-api-apiv1) •
[🏗️ Struktur](#️-struktur-direktori-server) •
[🚀 Perintah](#-perintah-pengembangan) •
[🐳 Docker](#-eksekusi-docker) •
[🛡️ Keamanan](#️-pertahanan-keamanan)

</div>

---

## 📡 Daftar Endpoint API (`/api/v1`)

| Method | Endpoint | Deskripsi Fungsi | Layer Proteksi |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/profile/:username` | Mengambil data profil publik, workstream proyek, riwayat log, & top skills | Rate Limited |
| `PUT` | `/api/v1/profile/:username` | Memperbarui bio, headline, link medsos, dan privasi kandidat | Zod Validator |
| `GET` | `/api/v1/profile/:username/messages` | Mengambil pesan-pesan rekruter untuk panel inbox dashboard kandidat | Rate Limited |
| `POST` | `/api/v1/logs` | Membuat log aktivitas mikro-jurnal harian baru beserta skill tags | Zod Validator |
| `PATCH` | `/api/v1/logs/:id/kudos` | Memberikan apresiasi / kudos pada entri log tertentu | Atomic Increment |
| `DELETE` | `/api/v1/logs/:id` | Menghapus entri log beserta relasi skill terkait | Transactional |
| `POST` | `/api/v1/projects` | Membuat wadah proyek baru (mendukung penanda mode rahasia NDA) | Zod Validator |
| `POST` | `/api/v1/contact` | Meneruskan pesan kontak rekruter secara aman (*Masked Email Relay*) | Anti-Spam Relay |
| `POST` | `/api/v1/report` | Menerima laporan indikasi penyalahgunaan konten atau profil spam | Zod Validator |

---

## 🏗️ Struktur Direktori Server

```
server/
├── prisma/
│   ├── schema.prisma        # Skema database PostgreSQL (Profiles, Projects, Logs, ContactMessage)
│   └── seed.ts              # Script seeding profil nyata Firli-stack & Proyek ASA ERP
├── src/
│   ├── controllers/         # contactController, logController, profileController, projectController
│   ├── routes/              # api.ts (Definisi dan pendaftaran rute endpoint REST v1)
│   ├── utils/               # prisma.ts (Koneksi singleton Prisma Client)
│   └── index.ts             # Entry point Express, rate limiter, middleware CORS, error handler
├── tsconfig.json            # Konfigurasi TypeScript ESM (NodeNext)
└── package.json             # Dependensi & script eksekusi
```

---

## 🚀 Perintah Pengembangan

| Perintah | Deskripsi Tindakan |
| :--- | :--- |
| `npm run dev` | Menjalankan server dalam mode hot-reload menggunakan `tsx watch` |
| `npm run build` | Mengompilasi kode TypeScript ke JavaScript murni di folder `dist/` |
| `npm start` | Menjalankan build produksi dari `dist/index.js` |
| `npm run prisma:generate` | Memperbarui artefak Prisma Client TypeScript |
| `npm run prisma:studio` | Membuka antarmuka grafis Prisma Studio di browser untuk audit data |

---

## 🐳 Eksekusi Docker

Server berjalan terisolasi di dalam container `logfolio_server`:

```bash
# 1. Menjalankan container server
docker compose up -d server

# 2. Menjalankan migrasi/sync skema ke database PostgreSQL Docker
docker exec logfolio_server npx prisma db push

# 3. Menjalankan seeding data di dalam container
docker exec logfolio_server npx tsx prisma/seed.ts
```

---

## 🛡️ Pertahanan Keamanan

1. **Global Rate Limiter**: Membatasi setiap IP maksimal 60 request per menit untuk mencegah bot scraping dan brute-force.
2. **Schema Sanitization**: Seluruh payload mutasi (`POST`, `PUT`, `PATCH`) divalidasi ketat dengan skema Zod sebelum menyentuh query database.
3. **Strict Clean Code**: Nol baris komentar teks hijau untuk menjaga integritas dan kerapian kode sumber produksi.
