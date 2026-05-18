import { Router } from 'express';

const router = Router();

router.get('/deliveries', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.delivery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/stock-ins', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.stockIn.findMany({
      include: { details: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;
