import { Router } from 'express';

const router = Router();

router.get('/assets', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.assetDetail.findMany({
      include: { components: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get('/assets/:id', async (req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const data = await prisma.assetDetail.findUnique({
      where: { id: req.params.id },
      include: { components: true, operations: true, repairs: true },
    });
    if (!data) return res.status(404).json({ success: false, message: '资产不存在' });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;
