Deploy a Render (step-by-step)

This guide shows how to push your project to GitHub and deploy on Render with a managed PostgreSQL database.

Prereqs
- A GitHub account and git installed locally
- A Render account (https://render.com)
- Docker is optional (we provided a Dockerfile)

Steps
1) Initialize git and push to GitHub
   git init
   git add .
   git commit -m "Initial"
   # create repo on GitHub and add remote, e.g.:
   git remote add origin git@github.com:<youruser>/<repo>.git
   git branch -M main
   git push -u origin main

2) On Render: create managed Postgres (recommended)
   - From Render dashboard -> New -> Database -> PostgreSQL
   - Choose a plan (free for small projects)
   - Note the connection details once created (user, password, host, port, database)

3) Apply schema to the managed DB
   Option A (recommended if you can run node locally):
     # Set DATABASE_URL to the Render DB connection string and run script
     # In PowerShell (Windows):
     $env:DATABASE_URL = 'postgres://USER:PASSWORD@HOST:PORT/DATABASE'; node scripts/apply-schema.js

   Option B (use psql):
     # If psql is available locally:
     PGPASSWORD=PASSWORD psql -h HOST -U USER -d DATABASE -f src/db/schema.sql
     # On PowerShell:
     $env:PGPASSWORD='PASSWORD'; psql -h HOST -U USER -d DATABASE -f src/db/schema.sql

4) Create a new Web Service on Render
   - From Render dashboard -> New -> Web Service
   - Connect your GitHub repo and select the branch (main)
   - Environment: Node
   - Build Command: (leave empty) or `npm install --production`
   - Start Command: `npm start` (or `node src/server.js`)
   - Set the environment variable `DATABASE_URL` with the managed DB connection string in the Render service settings (Environment -> Add Environment Variable)
   - Optionally set `NODE_ENV=production`

5) Deploy
   - Trigger a deploy on Render. The service will build and start.

6) Verify
   - Open the service URL from Render and test endpoints, e.g. <service-url>/api/providers
   - You can also use Thunder Client pointing to the Render URL.

Notes & tips
- If you prefer Docker deployment, the included Dockerfile will be used by Render when you choose "Deploy with Dockerfile".
- The `scripts/apply-schema.js` script reads `DATABASE_URL` and applies `src/db/schema.sql`.
- For repeated deployments/testing you may want a `db:reset` to wipe volumes (not provided for managed DBs).

If you want, I can:
- Create a `render.yaml` to configure services declaratively.
- Add a `db:reset` script (for local Docker volume resets).
- Help push the repo and connect the Render service interactively if you give the repo URL.
