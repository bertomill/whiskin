'use client';

import { useState } from 'react';
import StatsCard from './StatsCard';
import MealCard from './MealCard';
import ActionButtons from './ActionButtons';
import ErrorMessage from './ErrorMessage';
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

interface GenerateViewProps {
  meals: Meal[];
  currentMeal: Meal | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  onGetRandomMeal: () => void;
  onUpdateMeal: (mealId: string, updatedMeal: Omit<Meal, 'id'>) => Promise<void>;
  onClearMessages: () => void;
}

export default function GenerateView({
  meals,
  currentMeal,
  isLoading,
  error,
  success,
  onGetRandomMeal,
  onUpdateMeal,
  onClearMessages
}: GenerateViewProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditMeal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateMeal = async (updatedMeal: Omit<Meal, 'id'>) => {
    if (!currentMeal) return;
    
    await onUpdateMeal(currentMeal.id, updatedMeal);
    setShowEditModal(false);
  };

  return (
    <div className="pb-20"> {/* Add bottom padding to account for tab bar */}
      {/* Stats Card */}
      <StatsCard mealCount={meals.length} isLoading={isLoading} />

      {/* Error/Success Messages */}
      <ErrorMessage error={error} success={success} onClear={onClearMessages} />

      {/* Meal Card */}
      {currentMeal && (
        <MealCard 
          meal={currentMeal} 
          onEdit={handleEditMeal}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && currentMeal && (
        <EditModal
          meal={currentMeal}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateMeal}
        />
      )}

      {/* Action Buttons */}
      <ActionButtons 
        onGetRandomMeal={onGetRandomMeal}
        isLoading={isLoading}
      />
    </div>
  );
} 