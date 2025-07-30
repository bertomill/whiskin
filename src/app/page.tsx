'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import StatsCard from '@/components/StatsCard';
import MealCard from '@/components/MealCard';
import ActionButtons from '@/components/ActionButtons';
import ErrorMessage from '@/components/ErrorMessage';
import EditModal from '@/components/EditModal';

interface Meal {
  id: string;
  name: string;
  protein: string[];
  vegFruit: string[];
  otherIngredients: string[];
  carb: string[];
  image?: string;
}

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load meals from the API when component mounts
  useEffect(() => {
    loadMeals();
  }, []);

  // Clear success messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadMeals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/meals');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMeals(data.meals);
    } catch (error) {
      setError(`Error loading meals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomMeal = () => {
    if (meals.length === 0) {
      setError('No meals available. Please refresh from Notion.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * meals.length);
    const selectedMeal = meals[randomIndex];
    setCurrentMeal(selectedMeal);
    setError(null);
  };

  const handleEditMeal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateMeal = async (updatedMeal: Omit<Meal, 'id'>) => {
    if (!currentMeal) return;

    try {
      const response = await fetch(`/api/meals/${currentMeal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMeal),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update the meals array with the updated meal
      setMeals(prevMeals => 
        prevMeals.map(meal => 
          meal.id === currentMeal.id ? data.meal : meal
        )
      );
      
      // Update the current meal
      setCurrentMeal(data.meal);
      setSuccess(data.message || 'Meal updated successfully!');
      setShowEditModal(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Error updating meal: ${errorMessage}`);
      setShowEditModal(false); // Close modal even on error so user can see the error message
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="gradient-bg min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Card */}
        <StatsCard mealCount={meals.length} isLoading={isLoading} />

        {/* Error/Success Messages */}
        <ErrorMessage error={error} success={success} onClear={clearMessages} />

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
          onGetRandomMeal={getRandomMeal}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
