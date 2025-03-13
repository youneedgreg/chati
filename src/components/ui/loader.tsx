"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, CloudSun, Brain, Smile } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

export function MindfulLoader({ text = "Just taking a breath..." }: LoaderProps) {
  const icons = [
    { component: Heart, color: "text-pink-500" },
    { component: CloudSun, color: "text-blue-400" },
    { component: Brain, color: "text-purple-500" },
    { component: Smile, color: "text-yellow-500" }
  ];

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <div className="flex space-x-3 mb-4">
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
              <Icon.component size={28} />
            </motion.div>
          ))}
        </div>
        <p className="text-gray-600 text-center font-medium">{text}</p>
        <div className="mt-4 flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-2 w-2 bg-green-500 rounded-full"
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