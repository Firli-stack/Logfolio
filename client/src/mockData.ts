import type { UserProfile, Project, LogEntry, ProofLink } from './types';
export type { UserProfile, Project, LogEntry, ProofLink };

export const INITIAL_PROFILE: UserProfile = {
  username: "Firli-stack",
  fullName: "Firli Hanifurahman",
  headline: "Full-Stack & Systems Developer",
  bio: "Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem backend terukur, aplikasi modern, dan integrasi cloud.",
  location: "Batam, Indonesia",
  avatarUrl: "https://avatars.githubusercontent.com/u/201748538?v=4",
  timezone: "WIB",
  socialLinks: {
    github: "https://github.com/Firli-stack",
    linkedin: "https://linkedin.com",
    website: "https://github.com/Firli-stack/Logfolio"
  },
  streakDays: 14,
  totalLogs: 28,
  streakFreezeLeft: 2,
  topSkills: [
    { skill: "TypeScript", count: 18 },
    { skill: "React", count: 15 },
    { skill: "PostgreSQL", count: 12 },
    { skill: "Docker", count: 10 }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Logfolio Core Engine",
    description: "Engineering proof-of-work portfolio generator dengan real-time commit sync dan AI digest.",
    isStealthNda: false,
    technologies: ["TypeScript", "React", "PostgreSQL", "Docker"],
    repoUrl: "https://github.com/Firli-stack/Logfolio",
    liveUrl: "http://localhost:5173",
    status: "in_progress",
    logCount: 16
  },
  {
    id: "p2",
    title: "BTC Store Platform",
    description: "Toko dan sistem transaksi Bitcoin berbasis e-commerce modern.",
    isStealthNda: false,
    technologies: ["TypeScript", "Next.js", "Node.js"],
    repoUrl: "https://github.com/Firli-stack/btc-store",
    status: "in_progress",
    logCount: 8
  },
  {
    id: "p3",
    title: "FinalBridge Microservice",
    description: "Sistem penghubung layanan bridge data dan API gateway terintegrasi.",
    isStealthNda: false,
    technologies: ["Go", "Docker", "PostgreSQL"],
    repoUrl: "https://github.com/Firli-stack/finalbridge",
    status: "completed",
    logCount: 4
  }
];

export const INITIAL_LOGS: LogEntry[] = [
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
    isFeatured: true,
    isBackfill: false,
    kudosCount: 9,
    logDate: "19 Sep 2026",
    createdAt: "2026-09-19T22:20:00Z"
  },
  {
    id: "log-3",
    projectId: "p1",
    projectName: "Logfolio Core Engine",
    isStealthNda: false,
    title: "Modal Berbagi Portofolio Publik & QR Code",
    content: "Penerapan SharePortfolioModal interaktif dengan shortcut LinkedIn, WhatsApp, dan QR scanner.",
    details: [
      "Menghapus tombol ambigu pada Navbar.",
      "Menyediakan 1-klik copy URL publik /p/:username."
    ],
    skills: ["React", "TypeScript"],
    proofUrl: "https://github.com/Firli-stack/Logfolio/commit/5fd81ca",
    proofType: "github",
    isProofVerified: true,
    isFeatured: true,
    isBackfill: false,
    kudosCount: 15,
    logDate: "19 Sep 2026",
    createdAt: "2026-09-19T21:15:00Z"
  }
];
