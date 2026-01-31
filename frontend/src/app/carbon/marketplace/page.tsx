'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  category: string;
  location: string;
  minInvestment: number;
  featured: boolean;
  carbonImpact: string;
  fundingGoal: number;
  currentFunding: number;
  image?: string;
}

export default function CarbonMarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/public/projects');
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('carbonCart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        setCartItems(cart.map((item: { id: string }) => item.id));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Extract unique values for filters
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(projects.map(p => p.location).filter(Boolean)));
    return ['All Countries', ...uniqueCountries];
  }, [projects]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map(p => p.category)));
    return ['All Categories', ...uniqueCategories];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const countryMatch = selectedCountry === 'All Countries' || project.location === selectedCountry;
      const categoryMatch = selectedCategory === 'All Categories' || project.category === selectedCategory;
      const priceMatch = project.minInvestment >= priceRange[0] && project.minInvestment <= priceRange[1];

      return countryMatch && categoryMatch && priceMatch;
    });
  }, [projects, selectedCountry, selectedCategory, priceRange]);

  const handleAddToCart = (projectId: string) => {
    const existingCart = localStorage.getItem('carbonCart');
    let cart: Array<{ id: string; quantity: number }> = [];

    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }

    const existingItem = cart.find(item => item.id === projectId);
    if (existingItem) {
      return;
    }

    const project = projects.find(p => p._id === projectId);
    if (project) {
      const newCartItem = {
        id: project._id,
        projectName: project.name,
        location: project.location,
        minInvestment: project.minInvestment,
        quantity: 1,
        fundingGoal: project.fundingGoal,
        featured: project.featured,
        category: project.category,
        carbonImpact: project.carbonImpact,
      };

      cart.push(newCartItem);
      localStorage.setItem('carbonCart', JSON.stringify(cart));
      setCartItems([...cartItems, projectId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-semibold text-gray-700">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Browse and invest in verified carbon offset projects worldwide
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🔍</span> Filters
              </h2>

              {/* Country Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Investment: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCountry('All Countries');
                  setSelectedCategory('All Categories');
                  setPriceRange([0, 1000]);
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3">
                {cartItems.length > 0 && (
                  <Link
                    href="/carbon/cart"
                    className="relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>🛒</span>
                    <span>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Project Header */}
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors break-words">
                          {project.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-green-600 truncate">
                          {project.category}
                        </p>
                      </div>
                      {project.featured && (
                        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                          <span>⭐</span>
                          <span className="hidden sm:inline">Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span>📍</span>
                      <span className="font-medium truncate">{project.location || 'Global'}</span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Carbon Impact</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words sm:text-right">{project.carbonImpact}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Funding Progress</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 sm:text-right">
                          ${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 pt-3 border-t border-gray-200">
                        <span className="text-sm sm:text-base font-bold text-gray-900">Min Investment</span>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent sm:text-right">
                          ${project.minInvestment.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(project._id)}
                      disabled={cartItems.includes(project._id)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                        cartItems.includes(project._id)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {cartItems.includes(project._id) ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>✓</span>
                          Added to Cart
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>🛒</span>
                          Add to Cart
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => {
                    setSelectedCountry('All Countries');
                    setSelectedCategory('All Categories');
                    setPriceRange([0, 1000]);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
