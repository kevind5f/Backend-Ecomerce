import pool from '../config/db.config.js';

export const addProductToPayment = async ({
  payment_id,
  product_id,
  quantity
}) => {
  const query = `
    INSERT INTO payment_products (payment_id, product_id, quantity)
    VALUES ($1, $2, $3)
  `;

  await pool.query(query, [payment_id, product_id, quantity]);
};
