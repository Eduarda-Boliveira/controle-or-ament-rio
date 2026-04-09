import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.post('/', CategoryController.validateCreate, CategoryController.create);
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.getById);
router.put('/:id', CategoryController.validateUpdate, CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;
