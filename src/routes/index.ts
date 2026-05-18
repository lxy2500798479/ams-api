import { Router } from 'express';
import procurementRouter from './procurement';
import warehousingRouter from './warehousing';
import assetsRouter from './assets';
import operationsRouter from './operations';
import maintenanceRouter from './maintenance';

const router = Router();

router.use('/procurement', procurementRouter);
router.use('/warehousing', warehousingRouter);
router.use('/assets', assetsRouter);
router.use('/operations', operationsRouter);
router.use('/maintenance', maintenanceRouter);

export default router;
