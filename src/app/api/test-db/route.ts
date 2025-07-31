import { NextResponse } from 'next/server';
import { query, getRow } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Simple query to check connection
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful:', result.rows[0]);
    
    // Test 2: Check if User table is accessible
    const userCount = await query('SELECT COUNT(*) as count FROM "User"');
    console.log('✅ User table accessible:', userCount.rows[0]);
    
    // Test 3: Try to get a sample user
    const sampleUser = await getRow('SELECT id, name, email FROM "User" LIMIT 1');
    console.log('✅ Sample user query:', sampleUser);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      data: {
        currentTime: result.rows[0],
        userCount: userCount.rows[0],
        sampleUser: sampleUser
      }
    });
    
  } catch (error) {
    console.error('💥 Database test error:', error);
    console.error('💥 Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown'
    }, { status: 500 });
  }
} 