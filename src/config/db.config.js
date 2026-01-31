import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definido');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,                 // conexiones máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL conectado');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('🛑 Cerrando pool PostgreSQL...');
  await pool.end();
  process.exit(0);
});

export default pool;
