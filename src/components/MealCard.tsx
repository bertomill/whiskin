'use client';

import { useSession } from 'next-auth/react';

interface Meal {
  id: string;
  name: string;
  protein: string[];
  vegFruit: string[];
  otherIngredients: string[];
  carb: string[];
  image?: string;
}

interface MealCardProps {
  meal: Meal;
  onEdit: () => void;
}

export default function MealCard({ meal, onEdit }: MealCardProps) {
  const { data: session } = useSession();
  const displayIngredients = (type: string, ingredients: string[]) => {
    if (ingredients.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className={`text-base section-title text-gray-200 mb-2 flex items-center`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${
            type === 'protein' ? 'bg-red-500' :
            type === 'veg-fruit' ? 'bg-green-500' :
            type === 'carb' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}></div>
          {type === 'protein' ? 'Protein' :
           type === 'veg-fruit' ? 'Vegetables & Fruits' :
           type === 'carb' ? 'Carbohydrates' : 'Other Ingredients'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span key={index} className={`tag ${type}`}>
              {ingredient}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mb-4">
      <div className="bg-gray-800 rounded-3xl overflow-hidden card-shadow border border-gray-700/50">
        {/* Meal Image */}
        {meal.image && (
          <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
            <img 
              src={meal.image} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        {/* Meal Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl meal-name text-white text-center flex-1">
              {meal.name}
            </h2>
            {session && (
              <button 
                onClick={onEdit}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ml-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
            )}
          </div>
          
          {/* Ingredients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayIngredients('protein', meal.protein)}
            {displayIngredients('veg-fruit', meal.vegFruit)}
            {displayIngredients('carb', meal.carb)}
            {displayIngredients('other', meal.otherIngredients)}
          </div>
        </div>
      </div>
    </div>
  );
} 