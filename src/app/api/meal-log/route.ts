import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Simple in-memory storage for meal logs (in production, this would be a database)
// Format: { userId: { date: [mealId1, mealId2, ...] } }
const mealLogs: Record<string, Record<string, string[]>> = {};

// GET - Get meal logs for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    if (date) {
      // Get logs for specific date
      const userLogs = mealLogs[userId] || {};
      const dayLogs = userLogs[date] || [];

      return NextResponse.json({
        date,
        mealIds: dayLogs,
        count: dayLogs.length
      });
    } else {
      // Get all logs for user
      const userLogs = mealLogs[userId] || {};

      return NextResponse.json({
        logs: userLogs,
        totalDays: Object.keys(userLogs).length
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Log a meal for today
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const body = await request.json();
    const { mealId, date } = body;

    if (!mealId) {
      return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });
    }

    // Use provided date or today's date
    const logDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Initialize user logs if they don't exist
    if (!mealLogs[userId]) {
      mealLogs[userId] = {};
    }

    // Initialize day logs if they don't exist
    if (!mealLogs[userId][logDate]) {
      mealLogs[userId][logDate] = [];
    }

    // Check if meal is already logged for this date
    if (mealLogs[userId][logDate].includes(mealId)) {
      return NextResponse.json({
        message: 'Meal already logged for this date',
        date: logDate,
        mealId
      });
    }

    // Add meal to the log
    mealLogs[userId][logDate].push(mealId);

    return NextResponse.json({
      message: 'Meal logged successfully',
      date: logDate,
      mealId,
      totalForDay: mealLogs[userId][logDate].length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Remove a meal from the log
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const { searchParams } = new URL(request.url);
    const mealId = searchParams.get('mealId');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!mealId) {
      return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });
    }

    // Check if user has logs
    if (!mealLogs[userId] || !mealLogs[userId][date]) {
      return NextResponse.json({ error: 'No logs found for this date' }, { status: 404 });
    }

    // Remove meal from the log
    const dayLogs = mealLogs[userId][date];
    const mealIndex = dayLogs.indexOf(mealId);

    if (mealIndex === -1) {
      return NextResponse.json({ error: 'Meal not found in log for this date' }, { status: 404 });
    }

    dayLogs.splice(mealIndex, 1);

    // Clean up empty date entries
    if (dayLogs.length === 0) {
      delete mealLogs[userId][date];
    }

    return NextResponse.json({
      message: 'Meal removed from log',
      date,
      mealId,
      remainingForDay: dayLogs.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}