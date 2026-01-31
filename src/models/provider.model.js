import pool from '../config/db.config.js';

export const getAllProviders = async () => {
  const result = await pool.query(
    'SELECT * FROM providers WHERE active = true'
  );
  return result.rows;
};

export const getProviderById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM providers WHERE id = $1 AND active = true',
    [id]
  );
  return result.rows[0];
};

export const createProvider = async ({ name, email, phone }) => {
  const result = await pool.query(
    `INSERT INTO providers (name, email, phone)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, phone]
  );
  return result.rows[0];
};

export const updateProvider = async (id, { name, email, phone }) => {
  const result = await pool.query(
    `UPDATE providers
     SET name = $1, email = $2, phone = $3
     WHERE id = $4 AND active = true
     RETURNING *`,
    [name, email, phone, id]
  );
  return result.rows[0];
};

export const deleteProvider = async (id) => {
  const result = await pool.query(
    `UPDATE providers
     SET active = false
     WHERE id = $1 AND active = true
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};
