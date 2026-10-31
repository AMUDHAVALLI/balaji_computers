const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pgConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
};
const targetDb = process.env.PGDATABASE || 'sbc_puducherry_cctv';

async function setupPostgreSQL() {
  console.log('=====================================================');
  console.log('  Sri Balaji Computers - PostgreSQL 18 Setup Wizard  ');
  console.log('=====================================================');
  console.log(`Connecting to PostgreSQL at ${pgConfig.host}:${pgConfig.port} as user "${pgConfig.user}"...`);

  // Step 1: Connect to default 'postgres' database to check/create target DB
  const adminClient = new Client({
    ...pgConfig,
    database: 'postgres',
    connectionTimeoutMillis: 5000
  });

  try {
    await adminClient.connect();
    const checkRes = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (checkRes.rowCount === 0) {
      console.log(`Creating database "${targetDb}"...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Database "${targetDb}" created successfully.`);
    } else {
      console.log(`✅ Database "${targetDb}" already exists.`);
    }
  } catch (err) {
    console.error('\n❌ Failed to connect to local PostgreSQL:');
    console.error(`   Error: ${err.message}`);
    console.log('\n👉 Fix: Open "backend/.env" and update PGPASSWORD with your PostgreSQL 18 password.');
    process.exit(1);
  } finally {
    await adminClient.end().catch(() => {});
  }

  // Step 2: Connect to target database and apply schema.sql
  const pool = new Pool({
    ...pgConfig,
    database: targetDb
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log(`✅ Applied schema.sql (tables "leads" & "products" ready).`);

    const countRes = await pool.query('SELECT COUNT(*) AS count FROM leads');
    console.log(`📊 Current rows in "leads" table: ${countRes.rows[0].count}`);
    console.log('\n🎉 PostgreSQL 18 is connected and ready! Start the server with: npm start');
  } catch (err) {
    console.error('❌ Error applying schema.sql:', err.message);
    process.exit(1);
  } finally {
    await pool.end().catch(() => {});
  }
}

setupPostgreSQL();

