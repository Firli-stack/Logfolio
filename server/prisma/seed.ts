import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real profile Firli-stack and ASA ERP Project...');

  const profile = await prisma.profile.upsert({
    where: { username: 'Firli-stack' },
    update: {
      fullName: 'Firli Hanifurahman',
      headline: 'Full-Stack & Systems Developer',
      bio: 'Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem ERP terukur, arsitektur backend, dan aplikasi web modern.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/201748538?v=4',
      timezone: 'Asia/Jakarta',
      socialLinks: {
        github: 'https://github.com/Firli-stack',
        linkedin: 'https://linkedin.com',
        website: 'https://github.com/Firli-stack/Logfolio',
      },
      streakFreezeCount: 2,
    },
    create: {
      username: 'Firli-stack',
      fullName: 'Firli Hanifurahman',
      headline: 'Full-Stack & Systems Developer',
      bio: 'Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem ERP terukur, arsitektur backend, dan aplikasi web modern.',
      avatarUrl: 'https://avatars.githubusercontent.com/u/201748538?v=4',
      timezone: 'Asia/Jakarta',
      socialLinks: {
        github: 'https://github.com/Firli-stack',
        linkedin: 'https://linkedin.com',
        website: 'https://github.com/Firli-stack/Logfolio',
      },
      streakFreezeCount: 2,
    },
  });

  await prisma.log.deleteMany({ where: { userId: profile.id } });
  await prisma.project.deleteMany({ where: { userId: profile.id } });

  const skillNames = [
    'PHP',
    'MySQL',
    'JavaScript',
    'TypeScript',
    'React',
    'PostgreSQL',
    'Docker',
    'Git',
    'Node.js',
    'Next.js',
    'Go',
    'Performance',
    'Security',
    'Database',
    'Algorithms',
    'UI/UX'
  ];
  const skillMap: Record<string, string> = {};

  for (const name of skillNames) {
    const skill = await prisma.skill.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: {
        name,
        slug: name.toLowerCase(),
      },
    });
    skillMap[name] = skill.id;
  }

  // Project 1: ASA ERP (NDA Mode)
  const pAsa = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'ASA Internal ERP & Attendance Operations',
      description: 'Sistem operasional enterprise internal mencakup multi-shift presensi otomatis, manajemen material request, audit log, dan dashboard karyawan.',
      isStealthNda: true,
      status: 'in_progress',
      isFeatured: true,
    },
  });

  // Project 2: Logfolio
  const p1 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'Logfolio Core Engine',
      description: 'Engineering proof-of-work portfolio generator dengan real-time commit sync dan AI digest.',
      isStealthNda: false,
      repoUrl: 'https://github.com/Firli-stack/Logfolio',
      liveUrl: 'http://localhost:5173',
      status: 'in_progress',
      isFeatured: true,
    },
  });

  // Project 3: BTC Store
  const p2 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'BTC Store Platform',
      description: 'Toko dan sistem transaksi Bitcoin berbasis e-commerce modern.',
      isStealthNda: false,
      repoUrl: 'https://github.com/Firli-stack/btc-store',
      status: 'in_progress',
      isFeatured: true,
    },
  });

  // Project 4: FinalBridge
  const p3 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'FinalBridge Microservice',
      description: 'Sistem penghubung layanan bridge data dan API gateway terintegrasi.',
      isStealthNda: false,
      repoUrl: 'https://github.com/Firli-stack/finalbridge',
      status: 'completed',
    },
  });

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // ASA Logs
  const logAsa1 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: pAsa.id,
      content: 'Penyempurnaan mekanisme pemilihan bulan dan tahun pada Flatpickr datepicker untuk mencegah layout drift pada modul peminjaman alat operasional.',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 14,
      logDate: new Date(now - dayMs * 1),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: logAsa1.id, skillId: skillMap['JavaScript'] },
      { logId: logAsa1.id, skillId: skillMap['UI/UX'] },
    ],
  });

  const logAsa2 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: pAsa.id,
      content: 'Penyesuaian logika penghitungan skor leaderboard karyawan dengan menghapus penalti alpha agar performa dinilai secara murni dan objektif.',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 19,
      logDate: new Date(now - dayMs * 2),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: logAsa2.id, skillId: skillMap['PHP'] },
      { logId: logAsa2.id, skillId: skillMap['MySQL'] },
      { logId: logAsa2.id, skillId: skillMap['Algorithms'] },
    ],
  });

  const logAsa3 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: pAsa.id,
      content: 'Implementasi tab verifikasi antrean material admin, penyempurnaan UI selector urgensi barang, dan perbaikan formatter time picker.',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 22,
      logDate: new Date(now - dayMs * 3),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: logAsa3.id, skillId: skillMap['PHP'] },
      { logId: logAsa3.id, skillId: skillMap['MySQL'] },
      { logId: logAsa3.id, skillId: skillMap['JavaScript'] },
    ],
  });

  const logAsa4 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: pAsa.id,
      content: 'Menyinkronkan reset aktivitas kerja harian antara tabel project_daily_updates dan attendances dengan proteksi integritas transaksi database.',
      isProofVerified: true,
      isFeatured: false,
      kudosCount: 11,
      logDate: new Date(now - dayMs * 4),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: logAsa4.id, skillId: skillMap['MySQL'] },
      { logId: logAsa4.id, skillId: skillMap['PHP'] },
      { logId: logAsa4.id, skillId: skillMap['Database'] },
    ],
  });

  // Logfolio Logs
  const log1 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Implementasi integrasi GitHub API untuk mengambil riwayat commit real-time menjadi log terverifikasi.',
      proofUrl: 'https://github.com/Firli-stack/Logfolio/commit/522b806',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 16,
      logDate: new Date(now),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: log1.id, skillId: skillMap['TypeScript'] },
      { logId: log1.id, skillId: skillMap['Git'] },
      { logId: log1.id, skillId: skillMap['React'] },
    ],
  });

  const log2 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Refactoring arsitektur frontend menjadi pages, custom hooks, dan modular modal domains.',
      proofUrl: 'https://github.com/Firli-stack/Logfolio/commit/5f0f7e8',
      isProofVerified: true,
      isFeatured: false,
      kudosCount: 12,
      logDate: new Date(now - dayMs * 5),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: log2.id, skillId: skillMap['TypeScript'] },
      { logId: log2.id, skillId: skillMap['React'] },
    ],
  });

  console.log('✅ Real profile Firli-stack with ASA ERP Project seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
