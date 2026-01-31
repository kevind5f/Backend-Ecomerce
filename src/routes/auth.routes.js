import { Router } from 'express';
import { oauthCallback } from '../controllers/auth.controller.js';

const router = Router();

router.post('/oauth', oauthCallback);

export default router;
