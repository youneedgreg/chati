// components/ui/page-loader.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, CloudSun, Brain, Smile } from 'lucide-react';

export default function PageLoader() {
  const icons = [
    { component: Heart, color: "text-pink-500" },
    { component: CloudSun, color: "text-blue-400" },
    { component: Brain, color: "text-purple-500" },
    { component: Smile, color: "text-yellow-500" }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-100 to-green-200 flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">CHATI</h2>
        <div className="flex space-x-4 mb-6">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0.2, 1, 0.2], 
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3 
              }}
              className={`${Icon.color}`}
            >
              <Icon.component size={32} />
            </motion.div>
          ))}
        </div>
        <p className="text-gray-600 text-center font-medium mb-2">Taking a moment to center...</p>
        <p className="text-gray-500 text-sm text-center">Your wellness journey is about to begin</p>
        <div className="mt-6 flex space-x-3">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-3 w-3 bg-green-500 rounded-full"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: dot * 0.4
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}