import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;

const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL no está definido. Exporta DATABASE_URL y vuelve a ejecutar.');
  process.exit(1);
}

const sql = fs.readFileSync(schemaPath, 'utf8');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
  try {
    await client.connect();
    console.log('Conectado a la base. Aplicando schema.sql...');
    await client.query(sql);
    console.log('Schema aplicado (puede haber errores si ya existían objetos).');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error aplicando schema:', err.message || err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
})();
