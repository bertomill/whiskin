import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint helps us test if our database connection is working properly
// It's useful for debugging authentication and user creation issues

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Count total users
    const userCount = await prisma.user.count();
    console.log('👥 Total users in database:', userCount);

    // Get recent users (without passwords for security)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
            sessions: true,
          }
        }
      }
    });

    // Test NextAuth tables
    const accountCount = await prisma.account.count();
    const sessionCount = await prisma.session.count();

    console.log('📊 Database stats:', {
      users: userCount,
      accounts: accountCount,
      sessions: sessionCount,
      recentUsers: recentUsers.length
    });

    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      stats: {
        users: userCount,
        accounts: accountCount,
        sessions: sessionCount,
      },
      recentUsers,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('💥 Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 