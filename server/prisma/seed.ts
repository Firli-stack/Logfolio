import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Profile (Upsert)
  const profile = await prisma.profile.upsert({
    where: { username: 'alexdev' },
    update: {
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

  // Bersihkan data lama milik alexdev agar seed bersifat idempoten (bisa dijalankan berkali-kali tanpa duplikasi)
  await prisma.log.deleteMany({ where: { userId: profile.id } });
  await prisma.project.deleteMany({ where: { userId: profile.id } });

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

  // 4. Seed Logs dengan variasi tanggal (Streak aktif)
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  // Log Hari Ini
  const log1 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p1.id,
      content: 'Optimasi query laporan transaksi harian. Composite index menurunkan latensi dari 450ms ke 35ms.',
      proofUrl: 'https://github.com/enterprise/gateway/pull/182',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 16,
      logDate: today,
    },
  });

  await prisma.logSkill.createMany({
    data: [
      { logId: log1.id, skillId: skillMap['PostgreSQL'] },
      { logId: log1.id, skillId: skillMap['Go'] },
    ],
  });

  // Log Kemarin
  const log2 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p2.id,
      content: 'Kompresi gambar screenshot bukti kerja di sisi browser sebelum diunggah menjadi WebP < 150KB.',
      proofUrl: 'https://github.com/alexdev/logfolio/commit/8a2f4c',
      isProofVerified: true,
      isFeatured: true,
      kudosCount: 9,
      logDate: yesterday,
    },
  });

  await prisma.logSkill.createMany({
    data: [
      { logId: log2.id, skillId: skillMap['TypeScript'] },
      { logId: log2.id, skillId: skillMap['WebP'] },
    ],
  });

  // Log 2 Hari Lalu
  const log3 = await prisma.log.create({
    data: {
      userId: profile.id,
      projectId: p3.id,
      content: 'Implementasi Horizontal Pod Autoscaler berbasis metrik Kafka consumer lag.',
      proofUrl: 'https://github.com/alexdev/k8s-autoscale/pull/12',
      isProofVerified: true,
      isFeatured: false,
      kudosCount: 7,
      logDate: twoDaysAgo,
    },
  });

  await prisma.logSkill.createMany({
    data: [
      { logId: log3.id, skillId: skillMap['Kubernetes'] },
      { logId: log3.id, skillId: skillMap['Kafka'] },
      { logId: log3.id, skillId: skillMap['Go'] },
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
