import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createNewProduct
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createNewProduct);

export default router;
