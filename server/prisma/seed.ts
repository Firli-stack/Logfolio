import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Profile
  const profile = await prisma.profile.upsert({
    where: { username: 'alexdev' },
    update: {},
    create: {
      username: 'alexdev',
      fullName: 'Alex Pratama',
      headline: 'Backend & Systems Engineer',
      bio: 'Fokus pada arsitektur backend, database tuning, dan layanan berkinerja tinggi. Berpengalaman menangani sistem transaksi dan otomasi cloud.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timezone: 'Asia/Jakarta',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        website: 'https://alexpratama.dev',
      },
      streakFreezeCount: 2,
    },
  });

  // 2. Seed Skills
  const skillNames = ['PostgreSQL', 'Go', 'TypeScript', 'Docker', 'React', 'Kubernetes', 'WebP', 'Kafka', 'Redis'];
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

  // 3. Seed Projects
  const p1 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'Payment Gateway Core',
      description: 'Sistem pemrosesan pembayaran multi-bank dengan proteksi transaksi ganda dan enkripsi data.',
      isStealthNda: true,
      status: 'in_progress',
      isFeatured: true,
    },
  });

  const p2 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'Logfolio Portfolio',
      description: 'Aplikasi portofolio berbasis riwayat kerja harian dan verifikasi link pengerjaan.',
      isStealthNda: false,
      repoUrl: 'https://github.com/alexdev/logfolio',
      liveUrl: 'https://logfolio.dev',
      status: 'in_progress',
      isFeatured: true,
    },
  });

  const p3 = await prisma.project.create({
    data: {
      userId: profile.id,
      title: 'Kubernetes Autoscaler',
      description: 'Layanan penyesuaian kapasitas server otomatis berbasis antrean beban data.',
      isStealthNda: false,
      repoUrl: 'https://github.com/alexdev/k8s-autoscale',
      status: 'completed',
    },
  });

  // 4. Seed Logs
  const log1 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Optimasi query laporan transaksi harian. Composite index menurunkan latensi dari 450ms ke 35ms.',
      proofUrl: 'https://github.com/enterprise/gateway/pull/182',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 16,
      logDate: new Date(),
    },
  });

  await prisma.logSkill.createMany({
    data: [
      { logId: log1.id, skillId: skillMap['PostgreSQL'] },
      { logId: log1.id, skillId: skillMap['Go'] },
    ],
  });

  const log2 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p2.id,
      content: 'Kompresi gambar screenshot bukti kerja di sisi browser sebelum diunggah menjadi WebP < 150KB.',
      proofUrl: 'https://github.com/alexdev/logfolio/commit/8a2f4c',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 9,
      logDate: new Date(),
    },
  });

  await prisma.logSkill.createMany({
    data: [
      { logId: log2.id, skillId: skillMap['TypeScript'] },
      { logId: log2.id, skillId: skillMap['WebP'] },
    ],
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
