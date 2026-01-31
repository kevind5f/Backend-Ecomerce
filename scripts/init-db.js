import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple helper to run shell commands synchronously
const run = (cmd) => {
  console.log(`> ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'inherit' });
    return out;
  } catch (err) {
    console.error('Command failed:', cmd);
    throw err;
  }
};

// resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const composeFile = path.join(projectRoot, 'docker-compose.yml');
const schemaFile = path.join(projectRoot, 'src', 'db', 'schema.sql');

if (!fs.existsSync(composeFile)) {
  console.error('docker-compose.yml not found in project root. Aborting.');
  process.exit(1);
}

if (!fs.existsSync(schemaFile)) {
  console.error('schema.sql not found at src/db/schema.sql. Aborting.');
  process.exit(1);
}

try {
  console.log('Starting Docker Compose...');
  run('docker-compose up -d');

  console.log('Waiting for Postgres to be ready inside container...');
  const containerName = 'final-project';

  // Poll pg_isready inside the container with retries
  const maxAttempts = 30;
  const delayMs = 2000;
  let ready = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Checking Postgres readiness (attempt ${attempt}/${maxAttempts})...`);
      // pg_isready returns 0 when server is accepting connections
      run(`docker exec ${containerName} pg_isready -U alumno -d course-db`);
      ready = true;
      console.log('Postgres is ready');
      break;
    } catch (err) {
      console.log(`Not ready yet (attempt ${attempt}). Waiting ${delayMs}ms and retrying...`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
    }
  }

  if (!ready) {
    throw new Error('Postgres did not become ready in time');
  }

  // Apply schema
  console.log('Copying schema.sql into container and applying...');
  run(`docker cp "${schemaFile}" ${containerName}:/tmp/schema.sql`);
  run(`docker exec -i ${containerName} psql -U alumno -d course-db -f /tmp/schema.sql`);

  console.log('Database initialization completed.');
} catch (err) {
  console.error('Initialization failed:', err.message || err);
  process.exit(1);
}
