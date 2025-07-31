'use client';

import { useState } from 'react';
import MealCard from './MealCard';
import EditModal from './EditModal';

interface Meal {
  id: string;
  name: string;
  protein: string[];
  vegFruit: string[];
  otherIngredients: string[];
  carb: string[];
  image?: string;
}

interface AllMealsViewProps {
  meals: Meal[];
  onUpdateMeal: (mealId: string, updatedMeal: Omit<Meal, 'id'>) => Promise<void>;
}

export default function AllMealsView({ meals, onUpdateMeal }: AllMealsViewProps) {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter meals based on search term
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.protein.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
    meal.vegFruit.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
    meal.carb.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedMeal(null);
  };

  const handleUpdateMeal = async (updatedMeal: Omit<Meal, 'id'>) => {
    if (!selectedMeal) return;
    
    await onUpdateMeal(selectedMeal.id, updatedMeal);
    setShowEditModal(false);
    setSelectedMeal(null);
  };

  return (
    <div className="pb-20"> {/* Add bottom padding to account for tab bar */}
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm">
          {filteredMeals.length} of {meals.length} meals
        </p>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
            <p className="text-gray-400">
              {searchTerm ? 'No meals found matching your search.' : 'No meals available.'}
            </p>
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 hover:bg-white/15 transition-colors cursor-pointer"
              onClick={() => handleEditMeal(meal)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{meal.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.protein.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {meal.vegFruit.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {meal.carb.slice(0, 1).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {(meal.protein.length + meal.vegFruit.length + meal.carb.length) > 5 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                        +{meal.protein.length + meal.vegFruit.length + meal.carb.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedMeal && (
        <EditModal
          meal={selectedMeal}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateMeal}
        />
      )}
    </div>
  );
} 