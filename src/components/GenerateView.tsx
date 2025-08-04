'use client'; // This indicates that this component will run on the client side (in the browser)

// Import necessary dependencies and components
import StatsCard from './StatsCard';
import MealCard from './MealCard';
import ActionButtons from './ActionButtons';
import ErrorMessage from './ErrorMessage';

// Define the structure of a Meal object
interface Meal {
  id: string;          // Unique identifier for the meal
  name: string;        // Name of the meal
  protein: string[];   // Array of protein ingredients
  vegFruit: string[]; // Array of vegetable/fruit ingredients
  otherIngredients: string[]; // Array of other ingredients
  carb: string[];     // Array of carbohydrate ingredients
  image?: string;     // Optional image URL
}

// Define the props that the GenerateView component accepts
interface GenerateViewProps {
  meals: Meal[];      // Array of all meals
  currentMeal: Meal | null;  // Currently selected meal
  isLoading: boolean; // Loading state indicator
  error: string | null; // Error message if any
  success: string | null; // Success message if any
  onGetRandomMeal: () => void; // Function to get a random meal
  onClearMessages: () => void; // Function to clear error/success messages
}

// Main component definition
export default function GenerateView({
  meals,
  currentMeal,
  isLoading,
  error,
  success,
  onGetRandomMeal,
  onClearMessages
}: GenerateViewProps) {

  // Component's rendered UI
  return (
    <div className="pb-16"> {/* Container with bottom padding for tab bar */}
      {/* Display statistics about meals */}
      <StatsCard mealCount={meals.length} isLoading={isLoading} />

      {/* Display any error or success messages */}
      <ErrorMessage error={error} success={success} onClear={onClearMessages} />

      {/* Display the current meal if one is selected */}
      {currentMeal && (
        <MealCard 
          meal={currentMeal} 
        />
      )}

      {/* Buttons for user actions */}
      <ActionButtons 
        onGetRandomMeal={onGetRandomMeal}
        isLoading={isLoading}
      />
    </div>
  );
} 