import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    console.log('=== SMS API Debug Start ===');
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    console.log('Session check:', !!session?.user);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { phoneNumber, meal } = body;
    console.log('Request data:', { phoneNumber, mealName: meal?.name });

    // Validate required fields
    if (!phoneNumber || !meal) {
      console.log('Validation failed - missing data');
      return NextResponse.json(
        { error: 'Phone number and meal data are required' },
        { status: 400 }
      );
    }

    // Check Twilio configuration
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    console.log('Twilio config check:', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasFromNumber: !!fromNumber,
      fromNumber: fromNumber
    });

    if (!accountSid || !authToken || !fromNumber) {
      console.log('Missing Twilio configuration');
      return NextResponse.json(
        { error: 'SMS service not configured' },
        { status: 500 }
      );
    }

    // Format the meal information for SMS
    const mealText = formatMealForSMS(meal);
    console.log('Formatted message:', mealText);
    console.log('Message length:', mealText.length);

    // Send SMS via Twilio
    console.log('Attempting to send SMS...');
    const message = await client.messages.create({
      body: mealText,
      from: fromNumber,
      to: phoneNumber
    });

    console.log('Twilio response:', {
      sid: message.sid,
      status: message.status,
      direction: message.direction,
      from: message.from,
      to: message.to
    });

    console.log('=== SMS API Debug End ===');

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      status: message.status,
      message: 'Meal sent successfully!'
    });

  } catch (error) {
    console.error('=== SMS Error Details ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    
    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes('phone number')) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
      if (error.message.includes('authenticate')) {
        return NextResponse.json(
          { error: 'SMS service authentication failed' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: `Failed to send SMS: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

function formatMealForSMS(meal: any): string {
  const { name, protein, vegFruit, carb, otherIngredients } = meal;
  
  console.log('Formatting meal data:', {
    name,
    protein,
    vegFruit,
    carb,
    otherIngredients
  });
  
  // Start with meal name
  let message = `${name || 'Meal Recipe'}\n\n`;
  
  // Combine all ingredients into one list
  const allIngredients = [];
  
  if (protein && Array.isArray(protein) && protein.length > 0) {
    allIngredients.push(...protein);
  }
  
  if (vegFruit && Array.isArray(vegFruit) && vegFruit.length > 0) {
    allIngredients.push(...vegFruit);
  }
  
  if (carb && Array.isArray(carb) && carb.length > 0) {
    allIngredients.push(...carb);
  }
  
  if (otherIngredients && Array.isArray(otherIngredients) && otherIngredients.length > 0) {
    allIngredients.push(...otherIngredients);
  }
  
  // Add ingredients list
  if (allIngredients.length > 0) {
    message += `Ingredients: ${allIngredients.join(', ')}\n\n`;
  }
  
  message += `From Whiskin 🍴`;
  
  return message;
}