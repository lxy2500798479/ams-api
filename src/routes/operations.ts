import { Router } from 'express';

const router = Router();

router.get('/allocations', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.assetAllocation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/operations', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.assetOperation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/transfers', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.assetTransfer.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;
