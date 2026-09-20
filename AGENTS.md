# 🤖 AGENTS.md — Panduan & Aturan AI Agent (Logfolio)

Dokumen ini adalah acuan baku (*developer guidelines & rules*) bagi AI Agent (Antigravity) dan tim pengembang dalam memelihara, merefaktor, dan menambahkan fitur ke dalam repositori **Logfolio** (`Port Generator`).

---

## 1. 🏗️ Arsitektur Proyek & Lingkungan Eksekusi

### 1.1 Stack Teknologi
| Layer | Komponen | Detail Teknologi |
| :--- | :--- | :--- |
| **Frontend** | `client/` | React 18, TypeScript, Vite, Vanilla CSS Tokens, Lucide Icons |
| **Backend** | `server/` | Node.js, Express (ESM: `"type": "module"`), TypeScript, Prisma ORM, Zod |
| **Database** | `logfolio_postgres` | PostgreSQL 16 Alpine di Docker container |
| **Orchestration** | `docker-compose.yml` | Multi-container: client (`5173`), server (`5000`), postgres (`5432`) |

---

### 1.2 Aturan Operasional Docker
1. **Container Aktif Selalu di Docker**:
   - Backend Express: container `logfolio_server` (`http://localhost:5000`).
   - Frontend Nginx: container `logfolio_client` (`http://localhost:5173`).
   - Database PostgreSQL: container `logfolio_postgres` (port `5432`).
2. **Prosedur Sinkronisasi Kode ke Docker**:
   - **Skema Database (`server/prisma/schema.prisma`)**:
     ```bash
     npx prisma generate
     docker cp server/prisma/schema.prisma logfolio_server:/app/prisma/schema.prisma
     docker exec logfolio_server npx prisma db push
     ```
   - **Backend (`server/src/**`)**:
     ```bash
     cd server && npm run build
     docker cp server/dist logfolio_server:/app/
     docker restart logfolio_server
     ```
   - **Frontend (`client/src/**`)**:
     ```bash
     cd client && npm run build
     docker cp client/dist/. logfolio_client:/usr/share/nginx/html/
     ```

---

## 2. 💎 Standar Penulisan Kode (Coding Standards)

### 2.1 TypeScript & Type Safety
- **No Implicit Any**: Seluruh props komponen, argumen fungsi, dan return value API wajib memiliki tipe eksplisit di `client/src/types/index.ts` atau skema Zod.
- **ESM Import Path di Backend**: Backend menggunakan modul ESM asli. Setiap import lokal dari file `.ts` wajib menggunakan ekstensi `.js`:
  ```ts
  import prisma from '../utils/prisma.js';
  import { sendContactMessage } from '../controllers/contactController.js';
  ```
- **Zero Lint & Zero TypeScript Errors**: Wajib pastikan `npx tsc --noEmit` lolos dengan 0 error sebelum menyelesaikan pekerjaan.
- **Strict Clean Code (Tanpa Komentar / Teks Hijau)**: DILARANG menambahkan komentar kode (`// ...`, `/* ... */`, atau JSDoc) di seluruh codebase. Kode harus *self-explanatory* (bersih, deskriptif, dan rapi tanpa teks hijau yang mengotori file).

---

### 2.2 Frontend & UI/UX Principles
- **Glassmorphism & CSS Variables**:
  Gunakan variable tema yang sudah ada di `client/src/index.css` (contoh: `var(--accent-primary)`, `var(--bg-surface)`, `var(--border-subtle)`, `var(--text-primary)`, `var(--radius-md)`).
- **No TailwindCSS**: Jangan gunakan Tailwind CSS kecuali diminta secara eksplisit oleh pengguna. Pertahankan Vanilla CSS dan inline scoped styles yang rapi.
- **Micro-Interactions & Feedback**:
  Setiap aksi async (submit form, fetch data) wajib memiliki 3 state:
  - *Loading*: Tampilkan spinner (`Loader2` spin) dan nonaktifkan tombol.
  - *Success*: Indikator hijau / toast / pesan sukses.
  - *Error*: Banner error merah dengan pesan ramah pengguna.
- **Privacy & Stealth Mode**:
  Hormati proyek bertanda `isStealthNda = true`. Jangan pernah mengekspos tautan repo internal, nama klien sensitif, atau URL produksi internal pada view publik.

---

## 3. 🛡️ Desain API & Keamanan

### 3.1 REST API Conventions
- Semua endpoint API berada di bawah prefiks rute `/api/v1`.
- Format respon seragam:
  - Sukses (200 / 201):
    ```json
    { "message": "Operasi berhasil", "data": { ... } }
    ```
  - Error (400 / 404 / 500):
    ```json
    { "error": "Validation Error", "details": [ ... ] }
    ```

### 3.2 Pertahanan Keamanan (Security Hardening)
- **Rate Limiting**: Lindungi endpoint publik dari brute-force / spam bot (khususnya `/contact`, `/report`, dan `/logs`).
- **Input Sanitization**: Seluruh payload mutasi (`POST`, `PUT`, `PATCH`) wajib divalidasi dengan **Zod** sebelum dieksekusi oleh Prisma ORM.
- **SSRF Defense**: Saat memvalidasi URL eksternal (health-check proof link), larang koneksi ke IP private/loopback (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`).
- **Masked Contact Relay**: Alamat email kandidat tidak boleh ditampilkan mentah ke rekruter untuk melindungi dari scraper bot email.

---

## 4. 📦 Alur Git & Dokumentasi

- **Commit Message**: Wajib menggunakan konvensi Conventional Commits:
  - `feat(...)`: Fitur baru.
  - `fix(...)`: Perbaikan bug.
  - `refactor(...)`: Perubahan struktur kode tanpa mengubah fungsionalitas.
  - `chore(...)`: Pembaruan konfigurasi / dependensi.
- **Dokumentasi Terus Terkini**:
  Setiap penambahan endpoint, tabel database, atau fitur baru wajib dicatat pada `docs/PRD_SRS_Portfolio_Generator_v2.md`.
