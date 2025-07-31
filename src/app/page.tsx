'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import TabNavigation from '@/components/TabNavigation';
import GenerateView from '@/components/GenerateView';
import AllMealsView from '@/components/AllMealsView';
import AuthGuard from '@/components/AuthGuard';
import UserProfile from '@/components/UserProfile';

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
  const [activeTab, setActiveTab] = useState<'generate' | 'all-meals'>('generate');

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



  const handleUpdateMeal = async (mealId: string, updatedMeal: Omit<Meal, 'id'>) => {
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
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
          meal.id === mealId ? data.meal : meal
        )
      );
      
      // Update the current meal if it's the one being edited
      if (currentMeal && currentMeal.id === mealId) {
        setCurrentMeal(data.meal);
      }
      
      setSuccess(data.message || 'Meal updated successfully!');
      setError(null); // Clear any previous errors
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Error updating meal: ${errorMessage}`);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <AuthGuard>
      <div className="gradient-bg min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header with User Profile */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <UserProfile />
          </div>

          {/* Hero Section */}
          <HeroSection />

          {/* Tab Content */}
          {activeTab === 'generate' ? (
            <GenerateView
              meals={meals}
              currentMeal={currentMeal}
              isLoading={isLoading}
              error={error}
              success={success}
              onGetRandomMeal={getRandomMeal}
              onUpdateMeal={handleUpdateMeal}
              onClearMessages={clearMessages}
            />
          ) : (
            <AllMealsView
              meals={meals}
              onUpdateMeal={handleUpdateMeal}
            />
          )}

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
