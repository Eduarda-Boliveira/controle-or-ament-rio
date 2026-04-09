import { Router } from 'express';
import categoryRoutes from './categories';
import transactionRoutes from './transactions';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
