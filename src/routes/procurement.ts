import { Router } from 'express';

const router = Router();

// 供应商
router.get('/suppliers', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: suppliers });
  } catch (e) { next(e); }
});

// 合同
router.get('/contracts', async (_req, res, next) => {
  try {
    const { prisma } = await import('../utils/prisma');
    const contracts = await prisma.contract.findMany({
      include: { supplier: true, purchaseLists: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: contracts });
  } catch (e) { next(e); }
});

export default router;
