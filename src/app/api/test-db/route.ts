import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('🧪 Database test endpoint called');
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
    
    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Available tables:', tables);
    
    // Test User table specifically
    const userCount = await prisma.user.count();
    console.log('👥 User count:', userCount);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      data: {
        connection: 'ok',
        tables: tables,
        userCount: userCount
      }
    });
    
  } catch (error) {
    console.error('💥 Database test failed:', error);
    console.error('💥 Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown');
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 