import { Router } from 'express';
import {
  listProviders,
  getProvider,
  createNewProvider
} from '../controllers/provider.controller.js';
import { updateExistingProvider, removeProvider } from '../controllers/provider.controller.js';

const router = Router();

router.get('/', listProviders);
router.get('/:id', getProvider);
router.post('/', createNewProvider);
router.put('/:id', updateExistingProvider);
router.delete('/:id', removeProvider);

export default router;
