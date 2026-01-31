import { Router } from 'express';
import { createPaymentFlow } from '../controllers/payment.controller.js';

const router = Router();

router.post('/', createPaymentFlow);

export default router;