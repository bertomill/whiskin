import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// PUT - Update an existing meal
async function handleUpdateMeal(request: NextRequest, mealId: string) {
  const body = await request.json();
  const { name, protein, vegFruit, otherIngredients, carb, image } = body;

  if (!mealId) {
    return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });
  }

  const properties: any = {};

  // Update name if provided
  if (name) {
    properties.Name = {
      title: [
        {
          text: {
            content: name
          }
        }
      ]
    };
  }

  // Update protein ingredients
  if (protein !== undefined) {
    properties.Protein = {
      multi_select: protein.map((item: string) => ({ name: item }))
    };
  }

  // Update veg/fruit ingredients
  if (vegFruit !== undefined) {
    properties['Veg/Fruit'] = {
      multi_select: vegFruit.map((item: string) => ({ name: item }))
    };
  }

  // Update other ingredients
  if (otherIngredients !== undefined) {
    properties['Other Ingredients'] = {
      multi_select: otherIngredients.map((item: string) => ({ name: item }))
    };
  }

  // Update carb ingredients
  if (carb !== undefined) {
    properties.Carb = {
      multi_select: carb.map((item: string) => ({ name: item }))
    };
  }

  // Update image if provided - handle Notion's strict URL length limits
  if (image !== undefined) {
    if (image) {
      // Notion has a strict 2000 character limit for external URLs
      if (image.length > 2000) {
        console.warn(`Image URL too long for Notion API (${image.length} chars, max 2000). Skipping image update.`);
        // For images that are too long, we'll skip the image update
        // In a production app, you'd upload to a cloud service first
      } else if (image.startsWith('http')) {
        // Valid external URL that's within length limits
        properties.Image = {
          files: [
            {
              type: 'external',
              external: {
                url: image
              }
            }
          ]
        };
      } else {
        // For any other URLs (including data: URLs), skip to avoid errors
        console.warn('Skipping image update - URL format not supported by Notion or too large');
      }
    } else {
      // Clear the image
      properties.Image = {
        files: []
      };
    }
  }

  await notion.pages.update({
    page_id: mealId,
    properties
  });

  // Fetch the updated meal to return it
  const updatedMeal = await notion.pages.retrieve({ page_id: mealId });
  const updatedProperties = updatedMeal.properties;

  let updatedImageUrl = null;
  if (updatedProperties.Image && updatedProperties.Image.files && updatedProperties.Image.files.length > 0) {
    const imageFile = updatedProperties.Image.files[0];
    if (imageFile.type === 'external') {
      updatedImageUrl = imageFile.external.url;
    } else if (imageFile.type === 'file') {
      updatedImageUrl = imageFile.file.url;
    }
  }

  // Check if image was skipped and provide appropriate response
  const responseMessage = image && image.length > 2000 
    ? 'Meal updated successfully! Note: Image was too large for Notion and was not saved.'
    : 'Meal updated successfully';

  return NextResponse.json({
    message: responseMessage,
    meal: {
      id: updatedMeal.id,
      name: updatedProperties.Name?.title?.[0]?.plain_text || 'Unnamed Meal',
      protein: updatedProperties.Protein?.multi_select?.map(item => item.name) || [],
      vegFruit: updatedProperties['Veg/Fruit']?.multi_select?.map(item => item.name) || [],
      otherIngredients: updatedProperties['Other Ingredients']?.multi_select?.map(item => item.name) || [],
      carb: updatedProperties.Carb?.multi_select?.map(item => item.name) || [],
      image: updatedImageUrl
    },
    timestamp: new Date().toISOString()
  });
}

// DELETE - Delete a meal
async function handleDeleteMeal(mealId: string) {
  if (!mealId) {
    return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });
  }

  await notion.pages.update({
    page_id: mealId,
    archived: true
  });

  return NextResponse.json({
    message: 'Meal deleted successfully',
    mealId: mealId,
    timestamp: new Date().toISOString()
  });
}

// PUT handler for /api/meals/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }
  
  if (!databaseId) {
    return NextResponse.json({ error: 'NOTION_DATABASE_ID not configured' }, { status: 500 });
  }

  try {
    const params = await context.params;
    return await handleUpdateMeal(request, params.id);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE handler for /api/meals/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }
  
  if (!databaseId) {
    return NextResponse.json({ error: 'NOTION_DATABASE_ID not configured' }, { status: 500 });
  }

  try {
    const params = await context.params;
    return await handleDeleteMeal(params.id);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 