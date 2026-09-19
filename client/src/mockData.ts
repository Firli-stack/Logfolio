import type { UserProfile, Project, LogEntry, ProofLink } from './types';
export type { UserProfile, Project, LogEntry, ProofLink };

export const INITIAL_PROFILE: UserProfile = {
  username: "Firli-stack",
  fullName: "Firli Hanifurahman",
  headline: "Full-Stack & Systems Developer",
  bio: "Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem ERP terukur, arsitektur backend, dan aplikasi web modern.",
  location: "Batam, Indonesia",
  avatarUrl: "https://avatars.githubusercontent.com/u/201748538?v=4",
  timezone: "WIB",
  socialLinks: {
    github: "https://github.com/Firli-stack",
    linkedin: "https://linkedin.com",
    website: "https://github.com/Firli-stack/Logfolio"
  },
  streakDays: 48,
  totalLogs: 142,
  streakFreezeLeft: 2,
  topSkills: [
    { skill: "PHP", count: 85 },
    { skill: "MySQL", count: 72 },
    { skill: "JavaScript", count: 64 },
    { skill: "TypeScript", count: 42 },
    { skill: "Docker", count: 36 }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p-asa",
    title: "ASA Internal ERP & Attendance Operations",
    description: "Sistem operasional enterprise internal mencakup multi-shift presensi otomatis, manajemen material request, audit log, dan dashboard karyawan.",
    isStealthNda: true,
    technologies: ["PHP", "MySQL", "JavaScript", "Docker", "Nginx"],
    status: "in_progress",
    logCount: 299
  },
  {
    id: "p1",
    title: "Logfolio Core Engine",
    description: "Engineering proof-of-work portfolio generator dengan real-time commit sync dan AI digest.",
    isStealthNda: false,
    technologies: ["TypeScript", "React", "PostgreSQL", "Docker"],
    repoUrl: "https://github.com/Firli-stack/Logfolio",
    liveUrl: "http://localhost:5173",
    status: "in_progress",
    logCount: 38
  },
  {
    id: "p2",
    title: "BTC Store Platform",
    description: "Toko dan sistem transaksi Bitcoin berbasis e-commerce modern.",
    isStealthNda: false,
    technologies: ["TypeScript", "Next.js", "Node.js"],
    repoUrl: "https://github.com/Firli-stack/btc-store",
    status: "in_progress",
    logCount: 18
  },
  {
    id: "p3",
    title: "FinalBridge Microservice",
    description: "Sistem penghubung layanan bridge data dan API gateway terintegrasi.",
    isStealthNda: false,
    technologies: ["Go", "Docker", "PostgreSQL"],
    repoUrl: "https://github.com/Firli-stack/finalbridge",
    status: "completed",
    logCount: 14
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-asa-1",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Sinkronisasi Redraw Kalender & Datepicker Peminjaman Alat",
    content: "Penyempurnaan mekanisme pemilihan bulan dan tahun pada Flatpickr datepicker untuk mencegah layout drift pada modul peminjaman alat operasional.",
    details: [
      "Mengintegrasikan event redraw dinamis pada seleksi bulan/tahun.",
      "Memastikan konsistensi format tanggal ISO sebelum dikirim ke endpoint backend."
    ],
    skills: ["JavaScript", "UI/UX"],
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 14,
    logDate: "09 Sep 2026",
    createdAt: "2026-09-09T09:40:00Z"
  },
  {
    id: "log-asa-2",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Algoritma Perangkingan Leaderboard Berbasis Total Skor Murni",
    content: "Penyesuaian logika penghitungan skor leaderboard karyawan dengan menghapus penalti alpha agar performa dinilai secara murni dan objektif.",
    details: [
      "Refactoring SQL order clause pada tabel leaderboard untuk sorting kumulatif.",
      "Benchmark kalkulasi waktu pemrosesan query tetap di bawah 20ms."
    ],
    skills: ["PHP", "MySQL", "Algorithms"],
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 19,
    logDate: "09 Sep 2026",
    createdAt: "2026-09-09T08:38:00Z"
  },
  {
    id: "log-asa-3",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Modul Permintaan Material Admin & Selector Urgensi",
    content: "Implementasi tab verifikasi antrean material admin, penyempurnaan UI selector urgensi barang, dan perbaikan formatter time picker.",
    details: [
      "Membangun alur persetujuan material berjenjang antara Admin, Driver, dan Sales.",
      "Pemisahan status badge penolakan material dengan border netral terstruktur."
    ],
    skills: ["PHP", "MySQL", "JavaScript"],
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 22,
    logDate: "08 Sep 2026",
    createdAt: "2026-09-08T16:49:00Z"
  },
  {
    id: "log-asa-4",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Sinkronisasi Reset Aktivitas Harian Presensi Karyawan",
    content: "Menyinkronkan reset aktivitas kerja harian antara tabel project_daily_updates dan attendances dengan proteksi integritas transaksi.",
    details: [
      "Menyelesaikan ketidaksesuaian kolom query reset pada MySQL 8.",
      "Mengganti browser popup biasa dengan modal animasi terpusat yang responsif."
    ],
    skills: ["MySQL", "PHP", "Database"],
    isProofVerified: true,
    isFeatured: false,
    isBackfill: false,
    kudosCount: 11,
    logDate: "08 Sep 2026",
    createdAt: "2026-09-08T14:20:00Z"
  },
  {
    id: "log-asa-5",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Audit Log Helper & Manajemen Tipe Akun Dinamis",
    content: "Inisialisasi helper audit log berbasis PDO dan implementasi tipe akun dinamis di halaman user management admin.",
    details: [
      "Pencatatan riwayat aktivitas penting perusahaan ke audit log secara terpusat.",
      "Pemisahan peran hak akses antara akun staf dan akun customer."
    ],
    skills: ["PHP", "Security", "Backend"],
    isProofVerified: true,
    isFeatured: false,
    isBackfill: false,
    kudosCount: 16,
    logDate: "05 Sep 2026",
    createdAt: "2026-09-05T11:00:00Z"
  },
  {
    id: "log-asa-6",
    projectId: "p-asa",
    projectName: "ASA Internal ERP & Attendance Operations",
    isStealthNda: true,
    title: "Konfigurasi Shift Presensi & Validasi Window Check-in Otomatis",
    content: "Implementasi jam operasional check-in otomatis untuk Shift Pagi (05:00 - 08:30 WIB) dan Shift Malam (16:00 - 19:00 WIB) dengan batas keterlambatan ketat.",
    details: [
      "Menangani dynamic open minutes setting berbasis konfigurasi database.",
      "Memastikan redirect URL presensi konsisten mempertahankan status shift pengguna."
    ],
    skills: ["PHP", "MySQL", "Docker"],
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 28,
    logDate: "03 Sep 2026",
    createdAt: "2026-09-03T16:00:00Z"
  },
  {
    id: "log-1",
    projectId: "p1",
    projectName: "Logfolio Core Engine",
    isStealthNda: false,
    title: "Sinkronisasi Commit GitHub Otomatis",
    content: "Implementasi integrasi GitHub API untuk mengambil riwayat commit real-time menjadi log.",
    details: [
      "Mengambil commit repositori publik dari GitHub API.",
      "Ekstraksi hash SHA, pesan commit, dan deteksi skill otomatis."
    ],
    skills: ["TypeScript", "React", "Git"],
    proofUrl: "https://github.com/Firli-stack/Logfolio/commit/522b806",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 12,
    logDate: "20 Sep 2026",
    createdAt: "2026-09-20T05:30:00Z"
  },
  {
    id: "log-2",
    projectId: "p1",
    projectName: "Logfolio Core Engine",
    isStealthNda: false,
    title: "Modularisasi Arsitektur Feature-Driven",
    content: "Refactoring arsitektur frontend menjadi pages, custom hooks, dan modal domains.",
    details: [
      "Membuat usePortfolioData hook untuk memisahkan API dan state UI.",
      "Mengisolasi halaman PublicPortfolioPage dan DashboardPage."
    ],
    skills: ["TypeScript", "React"],
    proofUrl: "https://github.com/Firli-stack/Logfolio/commit/5f0f7e8",
    proofType: "github",
    isProofVerified: true,
    isFeatured: false,
    isBackfill: false,
    kudosCount: 9,
    logDate: "19 Sep 2026",
    createdAt: "2026-09-19T22:20:00Z"
  }
];
