import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';

const contactMessageSchema = z.object({
  targetUsername: z.string().min(1),
  recruiterName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  recruiterEmail: z.string().trim().email('Format email tidak valid').max(150),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter').max(2000, 'Pesan maksimal 2000 karakter'),
});

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const parseResult = contactMessageSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { targetUsername, recruiterName, recruiterEmail, message } = parseResult.data;

    const candidate = await prisma.profile.findFirst({
      where: {
        username: {
          equals: targetUsername,
          mode: 'insensitive',
        },
      },
      select: { id: true, username: true, fullName: true },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    const savedMessage = await prisma.contactMessage.create({
      data: {
        candidateId: candidate.id,
        recruiterName,
        recruiterEmail,
        message,
      },
    });

    return res.status(200).json({
      message: 'Contact message successfully relayed to candidate',
      data: {
        id: savedMessage.id,
        candidateUsername: candidate.username,
        candidateName: candidate.fullName,
        createdAt: savedMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in sendContactMessage:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getContactMessagesByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const candidate = await prisma.profile.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    const messages = await prisma.contactMessage.findMany({
      where: { candidateId: candidate.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      data: messages.map((m) => ({
        id: m.id,
        recruiterName: m.recruiterName,
        recruiterEmail: m.recruiterEmail,
        message: m.message,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error in getContactMessagesByUsername:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const profileReportSchema = z.object({
  targetUsername: z.string().min(1),
  reason: z.enum(['copyright', 'spam', 'nsfw', 'other']),
  details: z.string().trim().max(1000).optional(),
  reporterEmail: z.string().trim().email().max(150).optional().or(z.literal('')),
});

export const reportProfile = async (req: Request, res: Response) => {
  try {
    const parseResult = profileReportSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { targetUsername, reason, details, reporterEmail } = parseResult.data;

    const candidate = await prisma.profile.findFirst({
      where: {
        username: {
          equals: targetUsername,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Reported profile not found' });
    }

    const report = await prisma.profileReport.create({
      data: {
        candidateId: candidate.id,
        reason,
        details: details || null,
        reporterEmail: reporterEmail || null,
      },
    });

    return res.status(201).json({
      message: 'Report submitted successfully. Our team will review this shortly.',
      data: {
        id: report.id,
        createdAt: report.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in reportProfile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
