import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Add logging for database connection
const logQuery = (e: any) => {
  console.log('🗄️ Prisma Query:', e.query)
  console.log('⏱️ Prisma Duration:', e.duration + 'ms')
}

const logError = (e: any) => {
  console.error('💥 Prisma Error:', e.error)
  console.error('💥 Prisma Query:', e.query)
  console.error('💥 Prisma Duration:', e.duration + 'ms')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

// Add event listeners for logging
prisma.$on('query', logQuery)
prisma.$on('error', logError)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 