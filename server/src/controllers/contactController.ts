import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.js';

const contactMessageSchema = z.object({
  targetUsername: z.string().min(1),
  recruiterName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  recruiterEmail: z.string().trim().email('Format email tidak valid').max(150),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter').max(2000, 'Pesan maksimal 2000 karakter'),
  honeypot: z.string().optional(),
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

    const { targetUsername, recruiterName, recruiterEmail, message, honeypot } = parseResult.data;

    if (honeypot && honeypot.trim().length > 0) {
      return res.status(200).json({
        message: 'Contact message successfully relayed to candidate',
        data: {
          id: 'fake-bot-id',
          candidateUsername: targetUsername,
          candidateName: 'Candidate',
          createdAt: new Date().toISOString(),
        },
      });
    }

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
        status: 'unread',
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
        status: m.status || 'unread',
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error in getContactMessagesByUsername:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateMessageStatusSchema = z.object({
  status: z.enum(['unread', 'replied', 'archived', 'starred']),
});

export const updateContactMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = updateMessageStatusSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { status } = parseResult.data;

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      message: 'Message status updated',
      data: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error('Error in updateContactMessageStatus:', error);
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
