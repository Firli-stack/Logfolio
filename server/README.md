# ⚙️ Logfolio — Backend REST API Server

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)

<p align="center">
  <b>Backend REST API engine tangguh dengan validasi ketat Zod, ORM Prisma, dan proteksi anti-spam rate limiting.</b>
</p>

</div>

---

## 📡 Daftar Endpoint API (`/api/v1`)

| Method | Endpoint | Deskripsi | Proteksi |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/v1/profile/:username` | Mengambil profil publik, proyek, riwayat log, dan agregasi skill | Rate Limited |
| `PUT` | `/api/v1/profile/:username` | Memperbarui bio, headline, tautan sosial, dan status publik | Zod Validator |
| `GET` | `/api/v1/profile/:username/messages` | Mengambil daftar pesan rekruter untuk inbox dashboard kandidat | Rate Limited |
| `POST` | `/api/v1/logs` | Menambahkan catatan kerja harian baru dengan skill tags | Zod Validator |
| `PATCH` | `/api/v1/logs/:id/kudos` | Menambahkan apresiasi / kudos pada entri log tertentu | Atomik Increment |
| `DELETE` | `/api/v1/logs/:id` | Menghapus entri log beserta relasi skill terkait | Transactional |
| `POST` | `/api/v1/projects` | Membuat wadah proyek baru (termasuk mode stealth NDA) | Zod Validator |
| `POST` | `/api/v1/contact` | Meneruskan pesan kontak rekruter secara aman (Masked Relay) | Anti-Spam Relay |
| `POST` | `/api/v1/report` | Menerima laporan indikasi pelanggaran konten atau spam profil | Zod Validator |

---

## 🏗️ Struktur Direktori Server

```
server/
├── prisma/
│   ├── schema.prisma        # Definisi skema database PostgreSQL
│   └── seed.ts              # Script seeding profil nyata & proyek ASA ERP
├── src/
│   ├── controllers/         # contactController, logController, profileController, projectController
│   ├── routes/              # api.ts (pendaftaran route REST v1)
│   ├── utils/               # prisma.ts (koneksi singleton database)
│   └── index.ts             # Entry point Express, rate limiter, middleware
├── tsconfig.json            # Konfigurasi TypeScript ESM (NodeNext)
└── package.json             # Dependensi & script eksekusi
```

---

## 🚀 Perintah Pengembangan

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server dalam mode hot-reload menggunakan `tsx watch` |
| `npm run build` | Mengompilasi kode TypeScript ke JavaScript murni di folder `dist/` |
| `npm start` | Menjalankan build produksi dari `dist/index.js` |
| `npm run prisma:studio` | Membuka antarmuka grafis Prisma Studio untuk melihat isi database |

---

## 🐳 Eksekusi Docker

Server dijalankan di dalam container `logfolio_server`:
```bash
# Menjalankan container server
docker compose up -d server

# Menjalankan seeding data di dalam container
docker exec logfolio_server npx tsx prisma/seed.ts
```
