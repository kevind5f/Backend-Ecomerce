import pool from '../config/db.config.js';

export const createPayment = async ({
  user_id,
  amount,
  currency = 'PEN',
  status,
  culqi_charge_id = null
}) => {
  const query = `
    INSERT INTO payments (user_id, amount, currency, status, culqi_charge_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [user_id, amount, currency, status, culqi_charge_id];
  const { rows } = await pool.query(query, values);

  return rows[0];
};