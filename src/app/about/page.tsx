'use client';

import React from 'react';
import { IconChefHat, IconHeart, IconUsers, IconTarget, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-6">
            <IconChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">
            About Whiskin
          </h1>
          <p className="hero-subtitle text-xl text-stone-600 max-w-2xl mx-auto">
            Transforming how people think about healthy eating, one meal at a time
          </p>
        </motion.div>

        {/* The Problem Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <IconHeart className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="section-title text-2xl font-bold">The Problem We Solve</h2>
            </div>
            <p className="text-stone-700 text-lg leading-relaxed mb-4">
              We all know the feeling. You want to eat healthy, you plan to eat healthy, but when it comes time to actually buy the groceries and cook the meal, you draw a blank.
            </p>
            <p className="text-stone-700 text-lg leading-relaxed">
              <strong>What does healthy food actually look like?</strong> How do you cook it? What ingredients do you need? These simple questions become barriers that keep people from making the healthy choices they want to make.
            </p>
          </div>
        </motion.div>

        {/* The Solution Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <IconSparkles className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="section-title text-2xl font-bold">The Whiskin Solution</h2>
            </div>
            <p className="text-stone-700 text-lg leading-relaxed mb-4">
              Whiskin eliminates the friction between intention and action. With just one click, you get a complete, healthy, and delicious meal idea with all the details you need.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="font-semibold text-stone-800 mb-3">Instant Inspiration</h3>
                <p className="text-stone-600">No more staring at empty grocery lists or wondering what to cook. Get inspired instantly with curated healthy meal ideas.</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="font-semibold text-stone-800 mb-3">Complete Details</h3>
                <p className="text-stone-600">Every meal comes with ingredients, cooking instructions, and nutritional information - everything you need to succeed.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Vision Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                <IconTarget className="h-6 w-6 text-white" />
              </div>
              <h2 className="section-title text-2xl font-bold">Our Vision</h2>
            </div>
            <div className="text-center mb-8">
              <p className="text-stone-800 text-xl font-medium leading-relaxed">
                "I see a million people using Whiskin daily to upgrade their meal ideas and develop a stronger connection to their health and the health of their loved ones through delicious food."
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <IconUsers className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Community Impact</h3>
                <p className="text-stone-600">Helping families and individuals make healthier choices together</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <IconHeart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Health Connection</h3>
                <p className="text-stone-600">Building stronger relationships with food and wellness</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <IconChefHat className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Daily Inspiration</h3>
                <p className="text-stone-600">Making healthy eating a daily habit, not a chore</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200">
            <h2 className="section-title text-2xl font-bold mb-4">Ready to Transform Your Meals?</h2>
            <p className="text-stone-700 text-lg mb-6">
              Join thousands of people who are already making healthier choices with Whiskin.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Cooking Healthy Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 