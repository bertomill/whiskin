import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
  console.log('Testing Notion connection...');
  
  // Check environment variables
  const envCheck = {
    notionToken: !!process.env.NOTION_TOKEN,
    databaseId: !!databaseId,
    tokenLength: process.env.NOTION_TOKEN?.length || 0,
    databaseIdLength: databaseId?.length || 0
  };
  
  console.log('Environment check:', envCheck);
  
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ 
      error: 'NOTION_TOKEN not configured',
      envCheck
    }, { status: 500 });
  }
  
  if (!databaseId) {
    return NextResponse.json({ 
      error: 'NOTION_DATABASE_ID not configured',
      envCheck
    }, { status: 500 });
  }

  try {
    // Test basic API connection
    console.log('Testing Notion API connection...');
    const response = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    console.log('Successfully connected to Notion database');
    
    return NextResponse.json({
      success: true,
      message: 'Notion connection successful',
      database: {
        id: response.id,
        title: response.title?.[0]?.plain_text || 'Untitled',
        properties: Object.keys(response.properties || {})
      },
      envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Notion connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('unauthorized') || error.message.includes('401')) {
        statusCode = 401;
        errorMessage = 'Notion authentication failed - check your NOTION_TOKEN';
      } else if (error.message.includes('not_found') || error.message.includes('404')) {
        statusCode = 404;
        errorMessage = 'Notion database not found - check your NOTION_DATABASE_ID';
      } else if (error.message.includes('timeout') || error.message.includes('ConnectTimeoutError')) {
        statusCode = 504;
        errorMessage = 'Connection timeout - check your internet connection';
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      envCheck,
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: statusCode });
  }
} 