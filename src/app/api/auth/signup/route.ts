import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('🚀 Signup request received');
  
  try {
    const { name, email, password } = await request.json();
    console.log('📝 Request data:', { name, email, password: password ? '[HIDDEN]' : 'undefined' });

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Password too short:', password.length);
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking if user already exists...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    console.log('🔐 Hashing password...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed successfully');

    console.log('👤 Creating user in database...');
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('✅ User created successfully:', { id: user.id, email: user.email });

    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('💥 Signup error:', error);
    console.error('💥 Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      console.error('🔌 Database connection error detected');
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Check if it's a Prisma error
    if (error instanceof Error && error.message.includes('prisma')) {
      console.error('🗄️ Prisma database error detected');
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      );
    }

    // Check for specific Prisma error codes
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        console.error('🔑 Unique constraint violation (email already exists)');
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('P1001')) {
        console.error('🔌 Database server unreachable');
        return NextResponse.json(
          { error: 'Database server unreachable. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('P1002')) {
        console.error('⏰ Database connection timeout');
        return NextResponse.json(
          { error: 'Database connection timeout. Please try again later.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 