import pool from '../config/db.config.js';
import { createRefund } from '../models/refund.model.js';

export const refundPayment = async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id || !amount) {
      return res.status(400).json({
        message: 'payment_id y amount son obligatorios'
      });
    }

    // Verificar que el pago exista
    const paymentResult = await pool.query(
      'SELECT * FROM payments WHERE id = $1',
      [payment_id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Pago no encontrado'
      });
    }

    const payment = paymentResult.rows[0];

    // Validar monto
    if (Number(amount) > Number(payment.amount)) {
      return res.status(400).json({
        message: 'El monto a devolver no puede ser mayor al pago'
      });
    }

    // Simulación de refund exitoso (mock Culqi)
    const refund = await createRefund({
      payment_id,
      amount,
      reason
    });

    res.status(201).json({
      message: 'Devolución registrada correctamente',
      refund
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al procesar la devolución'
    });
  }
};
