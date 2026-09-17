export interface ProofLink {
  id: string;
  url: string;
  label: string;
  type?: 'github' | 'live' | 'figma' | 'document' | 'other';
}

export interface LogEntry {
  id: string;
  projectId: string;
  projectName: string;
  isStealthNda: boolean;
  title?: string; // Inti / Headline pencapaian utama
  content: string; // Teks lengkap / backward compatibility
  details?: string[]; // Poin-poin spesifik konteks teknis
  skills: string[];
  proofUrl?: string; // backwards compatibility
  proofType?: 'github' | 'live' | 'figma' | 'document';
  proofLinks?: ProofLink[]; // multiple proof links support
  isProofVerified: boolean;
  isFeatured: boolean;
  isBackfill: boolean;
  kudosCount: number;
  logDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  isStealthNda: boolean;
  technologies?: string[];
  repoUrl?: string;
  liveUrl?: string;
  status: 'in_progress' | 'completed' | 'archived';
  logCount: number;
}

export interface UserProfile {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  timezone: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  streakDays: number;
  totalLogs: number;
  streakFreezeLeft: number;
  topSkills: { skill: string; count: number }[];
}

export const INITIAL_PROFILE: UserProfile = {
  username: "alexdev",
  fullName: "Alex Pratama",
  headline: "Senior Distributed Systems & Backend Engineer",
  bio: "Membangun microservices berkinerja tinggi, payment gateways, dan cloud infra (99.99% uptime). Spesialisasi dalam konkurensi, database tuning, dan efisiensi resource.",

  location: "Jakarta, Indonesia",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  timezone: "Asia/Jakarta",
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
    title: "Core Payment Engine",
    description: "Gateway multi-bank berstandar PCI-DSS: enkripsi AES-256, jaminan idempotent payment, dan fault-tolerant Redis cluster.",
    isStealthNda: true,
    status: "in_progress",
    logCount: 38
  },
  {
    id: "p2",
    title: "Logfolio Portfolio Platform",
    description: "Platform verifikasi proof-of-work: auto-compile logbook, integrasi WebP, dan dashboard bento modern.",
    isStealthNda: false,
    repoUrl: "https://github.com/alexdev/logfolio",
    liveUrl: "https://logfolio.dev",
    status: "in_progress",
    logCount: 26
  },
  {
    id: "p3",
    title: "Kubernetes Autoscaling Mesh",
    description: "Custom Horizontal Pod Autoscaler berbasis streaming Kafka latency dengan efisiensi container Go.",
    isStealthNda: false,
    repoUrl: "https://github.com/alexdev/k8s-autoscale",
    status: "completed",
    logCount: 17
  }
];


export const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-1",
    projectId: "p1",
    projectName: "Core Payment Engine",
    isStealthNda: true,
    title: "Optimasi Query Agregasi PostgreSQL (Latensi Turun 450ms → 35ms)",
    content: "Selesai mengoptimasi query agregasi PostgreSQL, latency turun dari 450ms jadi 35ms. Telah diuji dengan 10k concurrent virtual users tanpa connection spike.",
    details: [
      "Mengganti subquery sekuensial dengan composite partial index pada tabel ledger transaksi multi-tenant.",
      "Stress test 10.000 concurrent users via k6 tanpa lonjakan saturasi CPU (koneksi stabil pada pool PgBouncer)."
    ],
    skills: ["PostgreSQL", "Database", "Performance"],
    proofUrl: "https://github.com/enterprise/gateway/pull/182",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 16,
    logDate: "2026-09-16",
    createdAt: "2026-09-16T14:30:00Z"
  },
  {
    id: "log-2",
    projectId: "p2",
    projectName: "Logfolio Portfolio Platform",
    isStealthNda: false,
    title: "Client-side WebP Compression Pipeline & Proteksi SSRF",
    content: "Merancang mitigasi SSRF dan client-side WebP compression (<150KB) untuk menghemat bandwidth cloud storage hingga 85%.",
    details: [
      "Kompresi lossy browser Canvas otomatis mereduksi ukuran screenshot dari ~2.4MB menjadi <120KB sebelum upload.",
      "Sanitasi URL bukti eksternal dengan DNS resolution guardrail untuk memitigasi celah intranet IP scanning."
    ],
    skills: ["TypeScript", "Security", "WebP"],
    proofUrl: "https://github.com/alexdev/logfolio/commit/8a2f4c",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 9,
    logDate: "2026-09-15",
    createdAt: "2026-09-15T18:15:00Z"
  },
  {
    id: "log-3",
    projectId: "p3",
    projectName: "Kubernetes Autoscaling Mesh",
    isStealthNda: false,
    title: "Pemangkasan Ukuran Image Docker Microservice: 1.2GB → 24MB",
    content: "Membuat multi-stage container build untuk Go microservice. Ukuran image berhasil dipangkas dari 1.2GB menjadi hanya 24MB.",
    details: [
      "Memanfaatkan multi-stage build berdasar scratch base image dengan binary Go yang di-strip flag `-ldflags=\"-s -w\"`.",
      "Memangkas waktu cold-start pod deploy di cluster EKS dari 48 detik menjadi di bawah 4 detik."
    ],
    skills: ["Docker", "Go", "DevOps"],
    proofUrl: "https://hub.docker.com/r/alexdev/mesh",
    proofType: "live",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 12,
    logDate: "2026-09-14",
    createdAt: "2026-09-14T11:20:00Z"
  },
  {
    id: "log-4",
    projectId: "p1",
    projectName: "Core Payment Engine",
    isStealthNda: true,
    title: "Redis Cluster Idempotency Shield untuk Pencegahan Double-Charge",
    content: "Implementasi idempotency key cache menggunakan Redis cluster untuk mencegah double-charge transaksi perbankan.",
    details: [
      "Atomic `SET NX EX` berdurasi 120 detik per request ID perbankan untuk menjamin single execution guarantee.",
      "Pencegahan total terhadap duplikasi payment ketika koneksi klien mengalami network timeout / retry mendadak."
    ],
    skills: ["Redis", "Distributed Systems"],
    proofUrl: "https://github.com/enterprise/gateway/commit/3ef91",
    proofType: "github",
    isProofVerified: true,
    isFeatured: false,
    isBackfill: false,
    kudosCount: 7,
    logDate: "2026-09-13",
    createdAt: "2026-09-13T16:00:00Z"
  }
];
