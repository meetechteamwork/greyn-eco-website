'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  gradient: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  change,
  trend = 'neutral',
  icon,
  gradient,
  description
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    ),
    neutral: null
  };

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Decorative Corner */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{icon}</span>
          </div>
          
          {/* Change Badge */}
          {change && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${trendColors[trend]}`}>
              {trendIcons[trend]}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-lg text-gray-500 font-medium">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* Bottom Accent Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </div>
  );
}


