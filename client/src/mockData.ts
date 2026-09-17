import type { UserProfile, Project, LogEntry, ProofLink } from './types';
export type { UserProfile, Project, LogEntry, ProofLink };

export const INITIAL_PROFILE: UserProfile = {
  username: "alexdev",
  fullName: "Alex Pratama",
  headline: "Backend & Systems Engineer",
  bio: "Fokus pada arsitektur backend, database tuning, dan layanan berkinerja tinggi. Berpengalaman menangani sistem transaksi dan otomasi cloud.",
  location: "Jakarta, Indonesia",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  timezone: "WIB",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    website: "https://alexpratama.dev"
  },
  streakDays: 48,
  totalLogs: 124,
  streakFreezeLeft: 2,
  topSkills: [
    { skill: "PostgreSQL", count: 42 },
    { skill: "Go", count: 35 },
    { skill: "TypeScript", count: 28 },
    { skill: "Docker", count: 19 }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Payment Gateway Core",
    description: "Sistem pemrosesan pembayaran multi-bank dengan proteksi transaksi ganda dan enkripsi data.",
    isStealthNda: true,
    technologies: ["Go", "PostgreSQL", "Redis"],
    status: "in_progress",
    logCount: 38
  },
  {
    id: "p2",
    title: "Logfolio Portfolio",
    description: "Aplikasi portofolio berbasis riwayat kerja harian dan verifikasi link pengerjaan.",
    isStealthNda: false,
    technologies: ["TypeScript", "React", "Vite"],
    repoUrl: "https://github.com/alexdev/logfolio",
    liveUrl: "https://logfolio.dev",
    status: "in_progress",
    logCount: 26
  },
  {
    id: "p3",
    title: "Kubernetes Autoscaler",
    description: "Layanan penyesuaian kapasitas server otomatis berbasis antrean beban data.",
    isStealthNda: false,
    technologies: ["Go", "Kubernetes", "Kafka"],
    repoUrl: "https://github.com/alexdev/k8s-autoscale",
    status: "completed",
    logCount: 17
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    projectId: "p1",
    projectName: "Payment Gateway Core",
    isStealthNda: true,
    title: "Optimasi Query Database Transaksi",
    content: "Optimasi query laporan transaksi harian.",
    details: [
      "Menambahkan composite index pada tabel pembayaran.",
      "Latensi response turun dari 450ms menjadi 35ms pada pengujian beban tinggi."
    ],
    skills: ["PostgreSQL", "Database"],
    proofUrl: "https://github.com/enterprise/gateway/pull/182",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 16,
    logDate: "16 Sep 2026",
    createdAt: "2026-09-16T14:30:00Z"
  },
  {
    id: "log-2",
    projectId: "p2",
    projectName: "Logfolio Portfolio",
    isStealthNda: false,
    title: "Kompresi Gambar Otomatis di Browser",
    content: "Kompresi gambar screenshot bukti kerja sebelum diunggah.",
    details: [
      "Konversi otomatis ke format WebP di sisi browser.",
      "Mengurangi ukuran file rata-rata dari 2MB menjadi di bawah 150KB."
    ],
    skills: ["TypeScript", "WebP"],
    proofUrl: "https://github.com/alexdev/logfolio/commit/8a2f4c",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 9,
    logDate: "15 Sep 2026",
    createdAt: "2026-09-15T18:15:00Z"
  },
  {
    id: "log-3",
    projectId: "p3",
    projectName: "Kubernetes Autoscaler",
    isStealthNda: false,
    title: "Pengecilan Ukuran Container Service",
    content: "Penerapan multi-stage build untuk container aplikasi.",
    details: [
      "Mengganti base image dengan scratch dan binary Go minimal.",
      "Ukuran image berhasil dipangkas dari 1.2GB menjadi 24MB."
    ],
    skills: ["Docker", "Go"],
    proofUrl: "https://hub.docker.com/r/alexdev/mesh",
    proofType: "live",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 12,
    logDate: "14 Sep 2026",
    createdAt: "2026-09-14T11:20:00Z"
  },
  {
    id: "log-4",
    projectId: "p1",
    projectName: "Payment Gateway Core",
    isStealthNda: true,
    title: "Pencegahan Transaksi Ganda (Idempotency)",
    content: "Implementasi kunci id unik pada transaksi perbankan.",
    details: [
      "Penyimpanan kunci transaksi sementara di Redis.",
      "Mencegah penarikan dana berulang saat jaringan pengguna terputus."
    ],
    skills: ["Redis", "Backend"],
    proofUrl: "https://github.com/enterprise/gateway/commit/3ef91",
    proofType: "github",
    isProofVerified: true,
    isFeatured: false,
    isBackfill: false,
    kudosCount: 7,
    logDate: "13 Sep 2026",
    createdAt: "2026-09-13T16:00:00Z"
  }
];
