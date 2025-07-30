'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Meal {
  id: string;
  name: string;
  protein: string[];
  vegFruit: string[];
  otherIngredients: string[];
  carb: string[];
  image?: string;
}

interface EditModalProps {
  meal: Meal;
  onClose: () => void;
  onUpdate: (updatedMeal: Omit<Meal, 'id'>) => void;
}

export default function EditModal({ meal, onClose, onUpdate }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: meal.name,
    image: meal.image || '',
    protein: meal.protein.join(', '),
    vegFruit: meal.vegFruit.join(', '),
    carb: meal.carb.join(', '),
    otherIngredients: meal.otherIngredients.join(', ')
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(meal.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasteHint, setShowPasteHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Add clipboard paste functionality
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Only handle paste when modal is focused
      if (!modalRef.current?.contains(document.activeElement)) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await processImageFile(file);
          }
          break;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show paste hint when Cmd+V or Ctrl+V is pressed
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        setShowPasteHint(true);
        setTimeout(() => setShowPasteHint(false), 2000);
      }
      
      // Allow Escape key to close modal
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    try {
      const updatedMeal = {
        name: formData.name,
        image: formData.image,
        protein: formData.protein.split(',').map(p => p.trim()).filter(p => p),
        vegFruit: formData.vegFruit.split(',').map(v => v.trim()).filter(v => v),
        carb: formData.carb.split(',').map(c => c.trim()).filter(c => c),
        otherIngredients: formData.otherIngredients.split(',').map(o => o.trim()).filter(o => o)
      };

      await onUpdate(updatedMeal);
    } catch (error) {
      console.error('Error updating meal:', error);
      // Don't close modal on error, let user try again or manually close
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Compress image to reduce payload size
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = width * (maxWidth / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processImageFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB limit for original file)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be smaller than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Start with very aggressive compression for Notion's 2000 character limit
      let compressedImage = await compressImage(file, 250, 0.3); // Much smaller and lower quality
      
      // Iteratively compress until it's under 1500 characters (bigger safety buffer)
      let maxWidth = 250;
      let quality = 0.3;
      let attempts = 0;
      const maxAttempts = 12; // More attempts
      
      while (compressedImage.length > 1500 && attempts < maxAttempts) {
        attempts++;
        
        if (attempts % 2 === 0) {
          // Reduce dimensions more aggressively
          maxWidth = Math.max(100, maxWidth * 0.75); // More aggressive reduction
        } else {
          // Reduce quality more aggressively
          quality = Math.max(0.05, quality * 0.6); // Lower minimum quality
        }
        
        console.log(`Compression attempt ${attempts}: width=${maxWidth}, quality=${quality}, current size=${compressedImage.length} chars`);
        compressedImage = await compressImage(file, Math.round(maxWidth), quality);
      }
      
      if (compressedImage.length > 1500) {
        // If still too large, try one final ultra-aggressive compression
        console.log('Trying ultra-aggressive final compression...');
        compressedImage = await compressImage(file, 80, 0.05); // Tiny image, lowest quality
        
        if (compressedImage.length > 1500) {
          alert(`Image is still too large for Notion after maximum compression (${compressedImage.length} characters). The image will not be saved to keep other meal data.`);
          console.warn(`Final compressed image size: ${compressedImage.length} characters (max 2000)`);
        }
      }
      
      setImagePreview(compressedImage);
      setFormData(prev => ({
        ...prev,
        image: compressedImage
      }));
      
      console.log(`Final image size: ${compressedImage.length} characters`);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    handleChange('image', url);
    setImagePreview(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          ref={modalRef}
          className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 relative"
          tabIndex={-1}
        >
          {/* Paste Hint Notification */}
          {showPasteHint && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm z-10 animate-pulse">
              📋 Paste an image from clipboard!
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Edit Meal</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 font-medium mb-2">Meal Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-200 font-medium mb-2">
                Image 
                <span className="text-gray-400 text-sm ml-2">
                  (Upload, paste with Cmd+V, or use URL)
                </span>
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative">
                  <img 
                    src={imagePreview} 
                    alt="Meal preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}

              {/* Upload Buttons */}
              <div className="flex gap-2 mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Compressing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      Upload Image
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowPasteHint(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  title="Click here then paste with Cmd+V or Ctrl+V"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Paste
                </button>
                
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Paste Instructions */}
              <div className="bg-gray-700/50 rounded-lg p-3 mb-3 border border-gray-600">
                                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>
                      <strong>Tip:</strong> Images are ultra-compressed to fit Notion's strict 2000 character limit. Copy an image then press <kbd className="bg-gray-600 px-1 rounded">Cmd+V</kbd> or <kbd className="bg-gray-600 px-1 rounded">Ctrl+V</kbd> to paste!
                    </span>
                  </div>
              </div>

              {/* URL Input (Alternative) */}
              <div className="text-gray-400 text-sm mb-2">Or paste an image URL:</div>
              <input 
                type="url" 
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 font-medium mb-2">Protein (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.protein}
                  onChange={(e) => handleChange('protein', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-200 font-medium mb-2">Vegetables & Fruits (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.vegFruit}
                  onChange={(e) => handleChange('vegFruit', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-200 font-medium mb-2">Carbohydrates (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.carb}
                  onChange={(e) => handleChange('carb', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-200 font-medium mb-2">Other Ingredients (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.otherIngredients}
                  onChange={(e) => handleChange('otherIngredients', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {isSaving ? 'Saving...' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 