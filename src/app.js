import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import providerRoutes from './routes/provider.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.routes.js';
import refundRoutes from './routes/refund.routes.js';

import { logger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Resolver __dirname en ES modules y servir frontend estático desde src/public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//Middlewares globales 
app.use(express.json());
app.use(logger);

//Endopoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/users', userRoutes);

//Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'Backend activo' });
});

// Middleware de errores (SIEMPRE AL FINAL)
app.use(errorHandler);

export default app;