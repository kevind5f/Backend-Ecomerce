import { Router } from 'express';
import { refundPayment } from '../controllers/refund.controller.js';

const router = Router();

router.post('/', refundPayment);

export default router;
