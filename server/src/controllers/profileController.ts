import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

// GET /api/v1/profile/:username - Get public portfolio profile
export const getProfileByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        logs: {
          orderBy: { logDate: 'desc' },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                isStealthNda: true,
              },
            },
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Hitung aggregasi statistik secara dinamis
    const totalLogs = profile.logs.length;
    const uniqueActiveDates = new Set(
      profile.logs.map((l) => l.logDate.toISOString().split('T')[0])
    );
    const totalActiveDays = uniqueActiveDates.size;

    // Hitung top skills
    const skillCounts: Record<string, number> = {};
    profile.logs.forEach((log) => {
      log.skills.forEach((ls) => {
        skillCounts[ls.skill.name] = (skillCounts[ls.skill.name] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Transformasi ke format konsumsi frontend
    const formattedProfile = {
      username: profile.username,
      fullName: profile.fullName,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      timezone: profile.timezone,
      socialLinks: profile.socialLinks,
      streakFreezeLeft: profile.streakFreezeCount,
      streakDays: totalActiveDays,
      totalLogs,
      topSkills,
      projects: profile.projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        isStealthNda: p.isStealthNda,
        repoUrl: p.repoUrl,
        liveUrl: p.liveUrl,
        status: p.status,
        isFeatured: p.isFeatured,
      })),
      logs: profile.logs.map((l) => ({
        id: l.id,
        projectId: l.projectId,
        projectName: l.project?.title || 'Personal / General',
        isStealthNda: l.project?.isStealthNda || false,
        content: l.content,
        proofUrl: l.proofUrl,
        proofImageUrl: l.proofImageUrl,
        isProofVerified: l.isProofVerified,
        isFeatured: l.isFeatured,
        isBackfill: l.isBackfill,
        kudosCount: l.kudosCount,
        logDate: l.logDate.toISOString().split('T')[0],
        skills: l.skills.map((s) => s.skill.name),
        createdAt: l.createdAt.toISOString(),
      })),
    };

    return res.status(200).json({ data: formattedProfile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
