import pool from '../config/db.config.js';
import { createCharge } from '../services/culqi.service.js';

export const createPaymentFlow = async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, token, email, products } = req.body;

    if (!user_id || !token || !products || !products.length) {
      return res.status(400).json({
        message: 'Datos incompletos'
      });
    }

    await client.query('BEGIN');

    let totalAmount = 0;
    for (const product of products) {
      totalAmount += product.price * product.quantity;
    }

    // 1. Cobro real en Culqi
    const charge = await createCharge({
      amount: totalAmount,
      currency: 'PEN',
      email,
      token
    });

    // 2. Guardar pago
    const paymentResult = await client.query(
      `
      INSERT INTO payments (user_id, amount, currency, status, culqi_charge_id)
      VALUES ($1, $2, 'PEN', 'PAID', $3)
      RETURNING *
      `,
      [user_id, totalAmount, charge.id]
    );

    const payment = paymentResult.rows[0];

    // 3. Guardar productos
    for (const product of products) {
      await client.query(
        `
        INSERT INTO payment_products (payment_id, product_id, quantity)
        VALUES ($1, $2, $3)
        `,
        [payment.id, product.product_id, product.quantity]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Pago procesado con Culqi',
      payment,
      culqi: charge
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      error?.response?.data || error.message
    );

    res.status(500).json({
      message: 'Error al procesar el pago con Culqi'
    });

  } finally {
    client.release();
  }
};
