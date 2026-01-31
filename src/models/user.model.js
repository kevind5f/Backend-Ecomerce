import pool from '../config/db.config.js';

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const createUser = async ({ oauth_id, email, name }) => {
  const result = await pool.query(
    `INSERT INTO users (oauth_id, email, name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [oauth_id, email, name]
  );
  return result.rows[0];
};
