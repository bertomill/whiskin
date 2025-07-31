import { Pool } from 'pg'

// Create a connection pool for direct PostgreSQL access
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Helper function to execute queries
export async function query(text: string, params: unknown[] = []) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('🗄️ Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('💥 Database query error:', error)
    throw error
  }
}

// Helper function to get a single row
export async function getRow(text: string, params: unknown[] = []) {
  const res = await query(text, params)
  return res.rows[0]
}

// Helper function to get multiple rows
export async function getRows(text: string, params: unknown[] = []) {
  const res = await query(text, params)
  return res.rows
}

// Helper function to execute a query without returning data
export async function execute(text: string, params: unknown[] = []) {
  const res = await query(text, params)
  return res.rowCount
}

// Clean up the pool when the app shuts down
process.on('beforeExit', async () => {
  await pool.end()
})

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await pool.end()
  process.exit(0)
}) 