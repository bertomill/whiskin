import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with minimal configuration for Supabase
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
})

// Helper function for raw SQL queries (useful for Supabase)
export async function executeRawQuery(query: string, params: unknown[] = []) {
  try {
    const result = await prisma.$executeRawUnsafe(query, ...params)
    return result
  } catch (error) {
    console.error('Raw query error:', error)
    throw error
  }
}

// Helper function for raw SQL queries that return data
export async function queryRaw(query: string, params: unknown[] = []) {
  try {
    const result = await prisma.$queryRawUnsafe(query, ...params)
    return result
  } catch (error) {
    console.error('Raw query error:', error)
    throw error
  }
}

// Handle connection cleanup for development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  
  // Add graceful shutdown handling
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
  
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
} 