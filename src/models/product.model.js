import pool from '../config/db.config.js';

export const getAllProducts = async () => {
  const result = await pool.query(
    'SELECT * FROM products WHERE active = true'
  );
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1 AND active = true',
    [id]
  );
  return result.rows[0];
};

export const createProduct = async ({ name, description, price }) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, price]
  );
  return result.rows[0];
};
