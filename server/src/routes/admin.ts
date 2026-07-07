import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireAdmin);

const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(['ADMIN', 'USER']),
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, fullName: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/users', async (req: AuthRequest, res) => {
  try {
    const data = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        fullName: data.fullName,
        role: data.role,
      },
      select: { id: true, username: true, fullName: true, role: true, isActive: true }
    });

    await prisma.auditLog.create({
      data: { userId: req.user!.id, action: 'CREATE_USER', details: { targetUsername: data.username, role: data.role }, ipAddress: req.ip }
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: (error as any).errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/users/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, role: true }
    });

    await prisma.auditLog.create({
      data: { userId: req.user!.id, action: 'UPDATE_USER_ROLE', details: { targetUserId: id, newRole: role }, ipAddress: (req.ip as any) || '' }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/users/:id/password', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    await prisma.auditLog.create({
      data: { userId: req.user!.id, action: 'RESET_PASSWORD', details: { targetUserId: id }, ipAddress: (req.ip as any) || '' }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/users/:id/enable', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    
    await prisma.user.update({
      where: { id },
      data: { isActive: true }
    });

    await prisma.auditLog.create({
      data: { userId: req.user!.id, action: 'ENABLE_USER', details: { targetUserId: id }, ipAddress: (req.ip as any) || '' }
    });

    res.json({ message: 'User enabled' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/users/:id/disable', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;

    if (id === req.user!.id) {
      return res.status(400).json({ message: 'Cannot disable yourself' });
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    await prisma.auditLog.create({
      data: { userId: req.user!.id, action: 'DISABLE_USER', details: { targetUserId: id }, ipAddress: (req.ip as any) || '' }
    });

    res.json({ message: 'User disabled' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
