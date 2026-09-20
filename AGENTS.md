# AGENTS.md - Panduan & Aturan Pengembangan Proyek Logfolio

Dokumen ini adalah acuan baku (*developer guidelines & rules*) bagi AI Agent (Antigravity) dan tim pengembang dalam memelihara, merefaktor, dan menambahkan fitur ke dalam proyek **Logfolio** (`Port Generator`).

---

## 1. Arsitektur Proyek & Lingkungan Eksekusi

### 1.1 Stack Teknologi
- **Frontend (`client/`)**: React 18, TypeScript, Vite, Vanilla CSS (Glassmorphism design tokens), Lucide Icons.
- **Backend (`server/`)**: Node.js, Express (ESM: `"type": "module"`), TypeScript, Prisma ORM, Zod validator.
- **Database**: PostgreSQL 16 (di Docker container `logfolio_postgres`).
- **Containerization**: Docker Compose (`docker-compose.yml` mengorkestrasi `client`, `server`, dan `postgres`).

### 1.2 Aturan Operasional Docker
1. **Lingkungan Aktif Selalu di Docker**:
   - Backend Express berjalan di container `logfolio_server` (port `5000`).
   - Frontend Nginx berjalan di container `logfolio_client` (port `5173`).
   - Database PostgreSQL berjalan di container `logfolio_postgres` (port `5432`).
2. **Sinkronisasi Perubahan Kode ke Docker**:
   - Jika mengubah schema database (`server/prisma/schema.prisma`):
     - Jalankan `npx prisma generate` di host dan salin schema ke container:
       `docker cp server/prisma/schema.prisma logfolio_server:/app/prisma/schema.prisma`
     - Jalankan `docker exec logfolio_server npx prisma db push` (atau generate di dalam container).
   - Jika mengubah kode backend (`server/src/**`):
     - Kompilasi `npm run build` di folder `server/`.
     - Salin `server/dist` ke container: `docker cp server/dist logfolio_server:/app/`
     - Restart server: `docker restart logfolio_server`.
   - Jika mengubah kode frontend (`client/src/**`):
     - Kompilasi `npm run build` di folder `client/`.
     - Salin hasil build: `docker cp client/dist/. logfolio_client:/usr/share/nginx/html/`.

---

## 2. Standar Penulisan Kode (Coding Standards)

### 2.1 TypeScript & Type Safety
- **No Implicit Any**: Semua props komponen, parameter fungsi, dan return value API harus didefinisikan tipenya secara eksplisit di [types/index.ts](file:///c:/Users/LENOVO/Documents/Port%20Generator/client/src/types/index.ts) (frontend) atau skema Zod (backend).
- **ESM Import Path di Backend**: Backend menggunakan modul ESM asli. Setiap import lokal dari file `.ts` wajib menggunakan akhiran `.js`, contoh:
  ```ts
  import prisma from '../utils/prisma.js';
  import { sendContactMessage } from '../controllers/contactController.js';
  ```
- **Zero Lint / Zero TypeScript Errors**: Selalu pastikan `npx tsc --noEmit` berhasil tanpa error sebelum menyelesaikan tugas.
- **Strict Clean Code (Tanpa Komentar / Teks Hijau)**: DILARANG menambahkan komentar kode (seperti `// ...`, `/* ... */`, atau JSDoc) di seluruh codebase. Kode harus *self-explanatory* (bersih, deskriptif, dan rapi tanpa teks hijau yang mengotori file). Jika ada komentar lama yang tersisa, segera bersihkan.

### 2.2 Frontend & UI/UX Principles
- **Glassmorphism & CSS Variables**:
  Gunakan variable tema yang sudah ada di [index.css](file:///c:/Users/LENOVO/Documents/Port%20Generator/client/src/index.css) (misal: `var(--accent-primary)`, `var(--bg-surface)`, `var(--border-subtle)`, `var(--text-primary)`, `var(--radius-md)`).
- **No TailwindCSS**: Jangan gunakan Tailwind CSS kecuali diminta secara eksplisit oleh pengguna. Pertahankan Vanilla CSS dan inline scoped styles yang rapi.
- **Micro-Interactions & Feedback**:
  Setiap aksi async (seperti submit form, sinkronisasi data) wajib memiliki state:
  - *Loading*: Tampilkan spinner (`Loader2` spin) dan nonaktifkan tombol.
  - *Success*: Indikator hijau / toast / pesan sukses.
  - *Error*: Banner error merah dengan pesan ramah pengguna.
- **Privacy & Stealth Mode**:
  Hormati proyek bertanda `isStealthNda = true`. Jangan mengekspos tautan repo internal, rahasia klien, atau URL sensitif pada view publik.

---

## 3. Desain API & Keamanan

### 3.1 REST API Conventions
- Semua endpoint API berada di bawah prefiks rute `/api/v1`.
- Struktur respon seragam:
  - Sukses: `{ "message": "...", "data": { ... } }` (status 200 / 201)
  - Error: `{ "error": "Validation Error", "details": [ ... ] }` (status 400 / 404 / 500)

### 3.2 Pertahanan Keamanan (Security Hardening)
- **Rate Limiting**: Lindungi endpoint publik dari serangan brute-force / spam (khususnya `/contact`, `/report`, dan `/logs`).
- **Input Sanitization**: Seluruh payload mutasi (`POST`, `PUT`, `PATCH`) wajib divalidasi dengan **Zod** sebelum dieksekusi oleh Prisma ORM.
- **SSRF Defense**: Saat memvalidasi URL eksternal (health-check proof link), larang koneksi ke IP private/loopback (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`).
- **Masked Contact Relay**: Alamat email kandidat tidak boleh ditampilkan mentah ke rekruter untuk melindungi dari scraper bot email.

---

## 4. Alur Git & Dokumentasi

- **Commit Message**: Gunakan konvensi Conventional Commits:
  - `feat(...)`: Fitur baru.
  - `fix(...)`: Perbaikan bug.
  - `refactor(...)`: Perubahan struktur kode tanpa mengubah fungsionalitas.
  - `chore(...)`: Pembaruan konfigurasi / dependensi.
- **Dokumentasi Terus Diperbarui**:
  Perubahan arsitektur, tabel database baru, atau endpoint baru harus dicatat pada [PRD_SRS_Portfolio_Generator_v2.md](file:///c:/Users/LENOVO/Documents/Port%20Generator/docs/PRD_SRS_Portfolio_Generator_v2.md) dan file panduan terkait.
