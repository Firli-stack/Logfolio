import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { verifyUrlSafe } from '../utils/ssrfValidator.js';

const createLogSchema = z.object({
  username: z.string().min(1),
  projectId: z.string().optional().nullable(),
  content: z.string().min(3).max(300),
  proofUrl: z.string().url().optional().or(z.literal('')),
  proofImageUrl: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).min(1).max(5),
  isFeatured: z.boolean().optional().default(false),
  isBackfill: z.boolean().optional().default(false),
  logDate: z.string().optional(),
});

export const createLog = async (req: Request, res: Response) => {
  try {
    const parseResult = createLogSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const {
      username,
      projectId,
      content,
      proofUrl,
      proofImageUrl,
      skills,
      isFeatured,
      isBackfill,
      logDate,
    } = parseResult.data;

    const user = await prisma.profile.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const skillIds: string[] = [];
    for (const skillName of skills) {
      const slug = skillName.toLowerCase().replace(/\s+/g, '-');
      const skill = await prisma.skill.upsert({
        where: { slug },
        update: {},
        create: { name: skillName, slug },
      });
      skillIds.push(skill.id);
    }

    let isProofVerified = false;
    if (proofUrl) {
      const check = await verifyUrlSafe(proofUrl);
      isProofVerified = check.isValid;
    }

    const newLog = await prisma.log.create({
      data: {
        userId: user.id,
        projectId: projectId || null,
        content,
        proofUrl: proofUrl || null,
        proofImageUrl: proofImageUrl || null,
        isProofVerified,
        isFeatured: !!isFeatured,
        isBackfill: !!isBackfill,
        logDate: logDate ? new Date(logDate) : new Date(),
        skills: {
          create: skillIds.map((skillId) => ({
            skill: { connect: { id: skillId } },
          })),
        },
      },
      include: {
        project: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    return res.status(201).json({
      message: 'Log created successfully',
      data: {
        id: newLog.id,
        projectId: newLog.projectId,
        projectName: newLog.project?.title || 'Personal / General',
        content: newLog.content,
        proofUrl: newLog.proofUrl,
        proofImageUrl: newLog.proofImageUrl,
        isProofVerified: newLog.isProofVerified,
        isFeatured: newLog.isFeatured,
        isBackfill: newLog.isBackfill,
        kudosCount: newLog.kudosCount,
        logDate: newLog.logDate.toISOString().split('T')[0],
        skills: newLog.skills.map((s) => s.skill.name),
        createdAt: newLog.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating log:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const verifyProofLink = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL wajib diisi' });
    }

    const result = await verifyUrlSafe(url);
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error verifying link:', error);
    return res.status(500).json({ error: 'Failed to verify URL' });
  }
};

export const addKudos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.log.update({
      where: { id },
      data: {
        kudosCount: { increment: 1 },
      },
    });

    return res.status(200).json({ message: 'Kudos added', kudosCount: updated.kudosCount });
  } catch (error) {
    console.error('Error adding kudos:', error);
    return res.status(500).json({ error: 'Failed to add kudos' });
  }
};

export const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.log.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Log not found' });
    }

    await prisma.$transaction([
      prisma.logSkill.deleteMany({
        where: { logId: id },
      }),
      prisma.log.delete({
        where: { id },
      }),
    ]);

    return res.status(200).json({
      message: 'Log deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    return res.status(500).json({ error: 'Failed to delete log' });
  }
};
