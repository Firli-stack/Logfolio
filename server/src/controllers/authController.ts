import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || '***REDACTED***';

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username hanya boleh huruf, angka, strip (-), dan garis bawah (_)'),
  email: z.string().trim().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().trim().min(2, 'Nama lengkap minimal 2 karakter').max(80),
});

const loginSchema = z.object({
  loginIdentifier: z.string().trim().min(1, 'Email atau Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

const oauthMockSchema = z.object({
  provider: z.enum(['google', 'github']),
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2),
  username: z.string().trim().min(3),
  avatarUrl: z.string().optional(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const { username, email, password, fullName } = parseResult.data;

    const existingUsername = await prisma.profile.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Username sudah digunakan oleh pengguna lain' });
    }

    const existingEmail = await prisma.profile.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newProfile = await prisma.profile.create({
      data: {
        username,
        email,
        passwordHash,
        fullName,
        authProvider: 'credentials',
        headline: 'Full-Stack Software Engineer',
        bio: 'Membangun sistem dan mencatat progres harian di Logfolio.',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      },
    });

    const token = jwt.sign(
      { id: newProfile.id, username: newProfile.username, email: newProfile.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        token,
        profile: {
          id: newProfile.id,
          username: newProfile.username,
          email: newProfile.email,
          fullName: newProfile.fullName,
          avatarUrl: newProfile.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const { loginIdentifier, password } = parseResult.data;

    const user = await prisma.profile.findFirst({
      where: {
        OR: [
          { username: { equals: loginIdentifier, mode: 'insensitive' } },
          { email: { equals: loginIdentifier, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Username/Email atau Password tidak cocok' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        error: `Akun ini terdaftar melalui ${user.authProvider || 'OAuth'}. Silakan masuk menggunakan metode tersebut.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username/Email atau Password tidak cocok' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: 'Login berhasil',
      data: {
        token,
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const oauthMockLogin = async (req: Request, res: Response) => {
  try {
    const parseResult = oauthMockSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.errors });
    }

    const { provider, email, fullName, username, avatarUrl } = parseResult.data;

    let user = await prisma.profile.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { username: { equals: username, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      user = await prisma.profile.create({
        data: {
          username,
          email,
          fullName,
          authProvider: provider,
          headline: `Developer | via ${provider.toUpperCase()}`,
          bio: `Autentikasi akun terhubung via ${provider.toUpperCase()}.`,
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: `Login berhasil via ${provider}`,
      data: {
        token,
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error in oauthMockLogin:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Token tidak disediakan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };

    const user = await prisma.profile.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        headline: true,
        avatarUrl: true,
        authProvider: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    return res.status(200).json({ data: user });
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Sesi token tidak valid atau telah kedaluwarsa' });
  }
};
