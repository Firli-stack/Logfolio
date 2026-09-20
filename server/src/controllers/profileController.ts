import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { calculateTimezoneAwareStreak } from '../utils/streakCalculator.js';

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

    const totalLogs = profile.logs.length;
    const logDates = profile.logs.map((l) => l.logDate);
    const streakResult = calculateTimezoneAwareStreak(
      logDates,
      profile.timezone || 'Asia/Jakarta',
      profile.streakFreezeCount
    );

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

    const formattedProfile = {
      username: profile.username,
      fullName: profile.fullName,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      timezone: profile.timezone,
      socialLinks: profile.socialLinks,
      streakFreezeLeft: streakResult.streakFreezeLeft,
      streakDays: streakResult.streakDays,
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

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  timezone: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const parseResult = updateProfileSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const { fullName, headline, bio, avatarUrl, timezone, socialLinks, isPublic } = parseResult.data;

    const existing = await prisma.profile.findUnique({
      where: { username },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updated = await prisma.profile.update({
      where: { username },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(headline !== undefined && { headline }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
        ...(timezone !== undefined && { timezone }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      data: {
        username: updated.username,
        fullName: updated.fullName,
        headline: updated.headline,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
        timezone: updated.timezone,
        socialLinks: updated.socialLinks,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
