import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real profile Firli-stack...');

  // 1. Seed Real Profile Firli Hanifurahman
  const profile = await prisma.profile.upsert({
    where: { username: 'Firli-stack' },
    update: {
      fullName: 'Firli Hanifurahman',
      headline: 'Full-Stack & Systems Developer',
      bio: 'Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem backend terukur, aplikasi modern, dan integrasi cloud.',
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
      bio: 'Computer Science Student at Politeknik Negeri Batam | Full-Stack & IoT Developer. Mengembangkan sistem backend terukur, aplikasi modern, dan integrasi cloud.',
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

  // 2. Seed Skills
  const skillNames = [
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
    'Database'
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

  // 3. Seed Real Projects
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

  // Log 1: Real GitHub Sync
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

  // Log 2: Modular Architecture
  const log2 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Refactoring arsitektur frontend menjadi pages, custom hooks, dan modular modal domains.',
      proofUrl: 'https://github.com/Firli-stack/Logfolio/commit/5f0f7e8',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 12,
      logDate: new Date(now - dayMs),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: log2.id, skillId: skillMap['TypeScript'] },
      { logId: log2.id, skillId: skillMap['React'] },
    ],
  });

  // Log 3: Share Portfolio Modal
  const log3 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Penerapan SharePortfolioModal interaktif dengan shortcut LinkedIn, WhatsApp, dan QR code scanner.',
      proofUrl: 'https://github.com/Firli-stack/Logfolio/commit/5fd81ca',
      isProofVerified: true,
      isFeatured: false,
      kudosCount: 9,
      logDate: new Date(now - dayMs * 2),
    },
  });
  await prisma.logSkill.createMany({
    data: [
      { logId: log3.id, skillId: skillMap['React'] },
      { logId: log3.id, skillId: skillMap['TypeScript'] },
    ],
  });

  console.log('✅ Real profile Firli-stack seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
