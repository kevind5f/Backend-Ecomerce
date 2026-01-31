import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { validateUser } from '../middlewares/validateUser.middleware.js';

const router = Router();

router.post('/', validateUser, registerUser);

export default router;