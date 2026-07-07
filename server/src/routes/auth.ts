import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      // Log failed attempt
      await prisma.auditLog.create({
        data: { action: 'LOGIN_FAILED', details: { username, reason: 'User not found' }, ipAddress: req.ip }
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      await prisma.auditLog.create({
        data: { action: 'LOGIN_FAILED', details: { username, reason: 'Account disabled' }, ipAddress: req.ip }
      });
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      await prisma.auditLog.create({
        data: { action: 'LOGIN_FAILED', details: { username, reason: 'Invalid password' }, ipAddress: req.ip }
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as any,
    });

    res.cookie('token', token, getCookieOptions());

    await prisma.auditLog.create({
      data: { userId: user.id, action: 'LOGIN_SUCCESS', ipAddress: req.ip }
    });

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  res.clearCookie('token', getCookieOptions());
  
  if (req.user) {
    await prisma.auditLog.create({
      data: { userId: req.user.id, action: 'LOGOUT', ipAddress: req.ip }
    });
  }
  
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, fullName: true, role: true, isActive: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
