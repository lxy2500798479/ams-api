import { Router } from 'express';

const router = Router();

router.get('/repairs', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.repair.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/inventories', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.inventory.findMany({
      include: { records: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/scraps', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.scrap.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;
