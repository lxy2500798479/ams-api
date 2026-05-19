import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// All user management routes require authentication and admin role
router.use(authMiddleware, requireRole('admin'));

// GET /api/user/list - paginated user list with filters
router.get('/list', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().max(100).default(20),
      username: z.string().optional(),
      phone: z.string().optional(),
      status: z.string().optional(),
    });

    const params = schema.parse(req.query);
    const { prisma } = await import('../utils/prisma');

    const where: Record<string, unknown> = {};
    if (params.username) where.username = { contains: params.username };
    if (params.phone) where.phone = { contains: params.phone };
    if (params.status) where.status = params.status;

    const [total, list] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, username: true, name: true, email: true,
          phone: true, role: true, status: true, avatar: true,
          createdAt: true, updatedAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        list,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      },
    });
  } catch (e) { next(e); }
});

// POST /api/user - create user
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      username: z.string().min(3).max(50),
      password: z.string().min(6).max(100),
      name: z.string().min(1).max(100),
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional(),
      role: z.enum(['admin', 'manager', 'user']).default('user'),
      status: z.enum(['active', 'disabled']).default('active'),
    });

    const data = schema.parse(req.body);
    const { prisma } = await import('../utils/prisma');

    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing) {
      return res.status(409).json({ success: false, message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: {
        id: true, username: true, name: true, email: true,
        phone: true, role: true, status: true, avatar: true, createdAt: true,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (e) { next(e); }
});

// PUT /api/user/:id - update user
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1).max(100).optional(),
      password: z.string().min(6).max(100).optional(),
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional(),
      role: z.enum(['admin', 'manager', 'user']).optional(),
      status: z.enum(['active', 'disabled']).optional(),
    });

    const data = schema.parse(req.body);
    const { prisma } = await import('../utils/prisma');

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updateData.password;
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true, username: true, name: true, email: true,
        phone: true, role: true, status: true, avatar: true, updatedAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

// DELETE /api/user/:id - delete user
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user?.id) {
      return res.status(400).json({ success: false, message: '不能删除自己' });
    }

    const { prisma } = await import('../utils/prisma');

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: '删除成功' });
  } catch (e) { next(e); }
});

export default router;
