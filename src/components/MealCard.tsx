'use client';

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
}

export default function MealCard({ meal }: MealCardProps) {
  const displayIngredients = (type: string, ingredients: string[]) => {
    if (ingredients.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className={`text-base section-title text-stone-700 mb-2 flex items-center`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${
            type === 'protein' ? 'bg-red-500' :
            type === 'veg-fruit' ? 'bg-green-500' :
            type === 'carb' ? 'bg-amber-500' : 'bg-stone-500'
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
      <div className="bg-white rounded-3xl overflow-hidden card-shadow border border-stone-200/50">
        {/* Meal Image */}
        {meal.image && (
          <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200">
            <img 
              src={meal.image} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/20"></div>
          </div>
        )}
        
        {/* Meal Content */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl meal-name text-stone-800 text-center">
              {meal.name}
            </h2>
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