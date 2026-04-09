import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.post('/', TransactionController.validateCreate, TransactionController.create);
router.get('/', TransactionController.list);
router.get('/balance', TransactionController.getBalance); 
router.get('/:id', TransactionController.getById);
router.put('/:id', TransactionController.validateUpdate, TransactionController.update);
router.delete('/:id', TransactionController.delete);

export default router;
