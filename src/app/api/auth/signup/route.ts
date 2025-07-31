import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getRow, execute } from '@/lib/db';
import { randomUUID } from 'crypto';

// This file handles new user registration (signup) in our application
// It receives user data, validates it, and creates a new user account

export async function POST(request: NextRequest) {
  // Log when we receive a signup request
  console.log('🚀 Signup request received');
  
  try {
    // Get the user's information from the request body
    // We need their name, email and password to create an account
    const { name, email, password } = await request.json();
    console.log('📝 Request data:', { name, email, password: password ? '[HIDDEN]' : 'undefined' });

    // Make sure all required information is provided
    // We check if name, email and password exist
    if (!name || !email || !password) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the password is long enough to be secure
    // We require at least 6 characters
    if (password.length < 6) {
      console.log('❌ Password too short:', password.length);
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Make sure the email address looks valid
    // It should follow the standard email format (example@domain.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking if user already exists...');
    
    // Look up if someone already has an account with this email
    // We don't want duplicate accounts with the same email
    const existingUser = await getRow('SELECT * FROM "User" WHERE email = $1', [email]);

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    console.log('🔐 Hashing password...');
    
    // Convert the password into a secure format before saving
    // This keeps the password safe even if someone sees our database
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Password hashed successfully');

    console.log('👤 Creating user in database...');
    
    // Create a new user account in our database
    // Store their name, email, and secured password
    const userId = randomUUID();
    const now = new Date();
    
    await execute(
      'INSERT INTO "User" (id, name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, name, email, hashedPassword, now, now]
    );

    console.log('✅ User created successfully:', { id: userId, email });

    // Get the created user (without password) for the response
    const user = await getRow(
      'SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt" FROM "User" WHERE id = $1',
      [userId]
    );

    // Send back a success message and the new user's information
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    // If anything goes wrong, we handle different types of errors here
    console.error('💥 Signup error:', error);
    console.error('💥 Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check if we can't connect to our database
    if (error instanceof Error && error.message.includes('connect')) {
      console.error('🔌 Database connection error detected');
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Check if there's a problem with our database operations
    if (error instanceof Error && error.message.includes('duplicate')) {
      console.error('🔑 Duplicate key error (email already exists)');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Handle specific database error cases
    if (error instanceof Error) {
      // If someone tries to use an email that's already taken
      if (error.message.includes('unique constraint')) {
        console.error('🔑 Unique constraint violation (email already exists)');
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      
      // If we can't reach the database server
      if (error.message.includes('ECONNREFUSED')) {
        console.error('🔌 Database server unreachable');
        return NextResponse.json(
          { error: 'Database server unreachable. Please try again later.' },
          { status: 503 }
        );
      }
      
      // If the database connection times out
      if (error.message.includes('timeout')) {
        console.error('⏰ Database connection timeout');
        return NextResponse.json(
          { error: 'Database connection timeout. Please try again later.' },
          { status: 503 }
        );
      }
    }

    // For any other unexpected errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 