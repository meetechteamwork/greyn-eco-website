'use client';

import React from 'react';
import Link from 'next/link';

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  height?: string;
  gradient?: string;
  href?: string;
  onClick?: () => void;
}

export default function ChartPlaceholder({
  title,
  description,
  height = 'h-64',
  gradient = 'from-blue-500 to-purple-500',
  href,
  onClick
}: ChartPlaceholderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Chart Area */}
      <div className={`${height} relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
          </svg>
        </div>

        {/* Chart Content Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Chart Icon */}
            <div className={`mx-auto mb-3 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            
            {/* Placeholder Text */}
            <p className="text-sm font-medium text-gray-600">Chart Visualization</p>
            <p className="text-xs text-gray-400 mt-1">Data will be displayed here</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient} opacity-30 animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: Today</span>
        {href ? (
          <Link 
            href={href}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View Details →
          </Link>
        ) : onClick ? (
          <button 
            onClick={onClick}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View Details →
          </button>
        ) : (
          <span className="text-gray-400 font-medium">View Details →</span>
        )}
      </div>
    </div>
  );
}


