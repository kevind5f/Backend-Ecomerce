import pool from '../config/db.config.js';

export const createRefund = async ({ payment_id, amount, reason }) => {
  const query = `
    INSERT INTO refunds (payment_id, amount, reason)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [payment_id, amount, reason];
  const { rows } = await pool.query(query, values);

  return rows[0];
};