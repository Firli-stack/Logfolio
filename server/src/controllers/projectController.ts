import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';

const createProjectSchema = z.object({
  username: z.string().min(1),
  title: z.string().min(2).max(100),
  description: z.string().optional(),
  repoUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  isStealthNda: z.boolean().optional().default(false),
  status: z.enum(['in_progress', 'completed', 'archived']).optional().default('in_progress'),
  isFeatured: z.boolean().optional().default(false),
});

export const createProject = async (req: Request, res: Response) => {
  try {
    const parseResult = createProjectSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const { username, title, description, repoUrl, liveUrl, isStealthNda, status, isFeatured } =
      parseResult.data;

    const user = await prisma.profile.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        repoUrl: repoUrl || null,
        liveUrl: liveUrl || null,
        isStealthNda: !!isStealthNda,
        status,
        isFeatured: !!isFeatured,
      },
    });

    return res.status(201).json({
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
