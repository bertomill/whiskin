'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import GenerateView from '@/components/GenerateView';
import AllMealsView from '@/components/AllMealsView';
import UserProfile from '@/components/UserProfile';
import WhiskinSidebar from '@/components/WhiskinSidebar';
import { cn } from '@/lib/utils';

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




  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <WhiskinSidebar
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onRefreshMeals={loadMeals}
    >
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-4 py-4">
          {/* Header with User Profile */}
          <div className="flex justify-between items-center mb-4">
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
              onClearMessages={clearMessages}
            />
          ) : (
            <AllMealsView
              meals={meals}
            />
          )}
        </div>
      </div>
    </WhiskinSidebar>
  );
}
