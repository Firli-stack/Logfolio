export interface LogEntry {
  id: string;
  projectId: string;
  projectName: string;
  isStealthNda: boolean;
  content: string;
  skills: string[];
  proofUrl?: string;
  proofType?: 'github' | 'live' | 'figma' | 'document';
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
    content: "Selesai mengoptimasi query agregasi PostgreSQL, latency turun dari 450ms jadi 35ms. Telah diuji dengan 10k concurrent virtual users tanpa connection spike.",
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
    content: "Merancang mitigasi SSRF dan client-side WebP compression (<150KB) untuk menghemat bandwidth cloud storage hingga 85%.",
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
    content: "Membuat multi-stage container build untuk Go microservice. Ukuran image berhasil dipangkas dari 1.2GB menjadi hanya 24MB.",
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
    content: "Implementasi idempotency key cache menggunakan Redis cluster untuk mencegah double-charge transaksi perbankan.",
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
