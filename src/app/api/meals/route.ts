import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// GET - Fetch all meals
async function handleGetMeals() {
  const response = await notion.databases.query({
    database_id: databaseId!,
    filter: {
      property: 'Name',
      title: {
        is_not_empty: true
      }
    }
  });

  const meals = response.results.map(page => {
    const properties = page.properties;
    
    // Extract image URL from the image property
    let imageUrl = null;
    if (properties.Image && properties.Image.files && properties.Image.files.length > 0) {
      const imageFile = properties.Image.files[0];
      if (imageFile.type === 'external') {
        imageUrl = imageFile.external.url;
      } else if (imageFile.type === 'file') {
        imageUrl = imageFile.file.url;
      }
    }
    
    return {
      id: page.id,
      name: properties.Name?.title?.[0]?.plain_text || 'Unnamed Meal',
      protein: properties.Protein?.multi_select?.map(item => item.name) || [],
      vegFruit: properties['Veg/Fruit']?.multi_select?.map(item => item.name) || [],
      otherIngredients: properties['Other Ingredients']?.multi_select?.map(item => item.name) || [],
      carb: properties.Carb?.multi_select?.map(item => item.name) || [],
      image: imageUrl
    };
  });

  return NextResponse.json({
    meals,
    count: meals.length,
    timestamp: new Date().toISOString()
  });
}

// POST - Create a new meal
async function handleCreateMeal(request: NextRequest) {
  const body = await request.json();
  const { name, protein, vegFruit, otherIngredients, carb, image } = body;

  if (!name) {
    return NextResponse.json({ error: 'Meal name is required' }, { status: 400 });
  }

  const properties: any = {
    Name: {
      title: [
        {
          text: {
            content: name
          }
        }
      ]
    }
  };

  // Add protein ingredients
  if (protein && protein.length > 0) {
    properties.Protein = {
      multi_select: protein.map((item: string) => ({ name: item }))
    };
  }

  // Add veg/fruit ingredients
  if (vegFruit && vegFruit.length > 0) {
    properties['Veg/Fruit'] = {
      multi_select: vegFruit.map((item: string) => ({ name: item }))
    };
  }

  // Add other ingredients
  if (otherIngredients && otherIngredients.length > 0) {
    properties['Other Ingredients'] = {
      multi_select: otherIngredients.map((item: string) => ({ name: item }))
    };
  }

  // Add carb ingredients
  if (carb && carb.length > 0) {
    properties.Carb = {
      multi_select: carb.map((item: string) => ({ name: item }))
    };
  }

  // Add image if provided
  if (image) {
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
  }

  const response = await notion.pages.create({
    parent: {
      database_id: databaseId!
    },
    properties
  });

  return NextResponse.json({
    message: 'Meal created successfully',
    mealId: response.id,
    timestamp: new Date().toISOString()
  }, { status: 201 });
}

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

  // Update image if provided
  if (image !== undefined) {
    properties.Image = {
      files: image ? [
        {
          type: 'external',
          external: {
            url: image
          }
        }
      ] : []
    };
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

  return NextResponse.json({
    message: 'Meal updated successfully',
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

// Main handler for /api/meals
export async function GET() {
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }
  
  if (!databaseId) {
    return NextResponse.json({ error: 'NOTION_DATABASE_ID not configured' }, { status: 500 });
  }

  try {
    return await handleGetMeals();
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.NOTION_TOKEN) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }
  
  if (!databaseId) {
    return NextResponse.json({ error: 'NOTION_DATABASE_ID not configured' }, { status: 500 });
  }

  try {
    return await handleCreateMeal(request);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}