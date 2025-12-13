'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MonthlyData {
  month: string;
  investments: number;
  returns: number;
  carbonCredits: number;
}

const AnalyticsPage: React.FC = () => {

  // Mock data
  const monthlyData: MonthlyData[] = [
    { month: 'Jan', investments: 500, returns: 25, carbonCredits: 12 },
    { month: 'Feb', investments: 800, returns: 45, carbonCredits: 18 },
    { month: 'Mar', investments: 1200, returns: 78, carbonCredits: 28 },
    { month: 'Apr', investments: 1500, returns: 125, carbonCredits: 35 },
    { month: 'May', investments: 2000, returns: 187, carbonCredits: 48 },
    { month: 'Jun', investments: 2500, returns: 267, carbonCredits: 62 },
    { month: 'Jul', investments: 3200, returns: 398, carbonCredits: 85 },
    { month: 'Aug', investments: 4100, returns: 547, carbonCredits: 112 },
    { month: 'Sep', investments: 4800, returns: 625, carbonCredits: 128 },
    { month: 'Oct', investments: 5200, returns: 687, carbonCredits: 138 },
    { month: 'Nov', investments: 5500, returns: 712, carbonCredits: 143 }
  ];

  const portfolioDistribution = [
    { category: 'Solar Energy', percentage: 45, amount: 2475, color: 'bg-yellow-500' },
    { category: 'Wind Energy', percentage: 27, amount: 1485, color: 'bg-blue-500' },
    { category: 'Reforestation', percentage: 18, amount: 990, color: 'bg-green-500' },
    { category: 'Other', percentage: 10, amount: 550, color: 'bg-purple-500' }
  ];

  const topPerformers = [
    { name: 'Solar Energy Farm - California', growth: '+12%', status: 'up' },
    { name: 'Electric Vehicle Charging Network', growth: '+18%', status: 'up' },
    { name: 'Wind Power Initiative - Texas', growth: '+9%', status: 'up' },
    { name: 'Amazon Rainforest Reforestation', growth: '+7%', status: 'up' }
  ];

  const stats = {
    totalValue: 6187.50,
    totalReturns: 687.50,
    totalCarbonCredits: 142.75,
    growthRate: '+15.3%',
    projectsCount: 4
  };

  const maxInvestment = Math.max(...monthlyData.map(d => d.investments));
  const maxReturns = Math.max(...monthlyData.map(d => d.returns));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
              Investment Analytics
            </h1>
            <p className="text-lg text-gray-600">
              Detailed insights and performance metrics for your portfolio
            </p>
          </div>

          {/* Key Metrics */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10"></div>
              <div className="relative">
                <p className="mb-1 text-sm font-medium text-green-100">Portfolio Value</p>
                <p className="text-3xl font-bold">${stats.totalValue.toLocaleString()}</p>
                <p className="mt-2 text-sm text-green-100">{stats.growthRate} this year</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalReturns.toLocaleString()}</p>
              <p className="mt-2 text-sm text-gray-600">From {stats.projectsCount} projects</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm font-medium text-gray-600">Carbon Credits</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCarbonCredits}</p>
              <p className="mt-2 text-sm text-gray-600">{(stats.totalCarbonCredits * 0.5).toFixed(0)} tons CO₂</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.projectsCount}</p>
              <p className="mt-2 text-sm text-gray-600">All performing well</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Charts Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Investment Growth Chart */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Investment Growth</h2>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Investments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">Returns</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-80">
                  <svg viewBox="0 0 900 320" className="h-full w-full" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 80}
                        x2="900"
                        y2={i * 80}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Investments Line */}
                    <polyline
                      points={monthlyData.map((d, i) => 
                        `${(i * 900) / (monthlyData.length - 1)},${320 - (d.investments / maxInvestment) * 280}`
                      ).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Returns Line */}
                    <polyline
                      points={monthlyData.map((d, i) => 
                        `${(i * 900) / (monthlyData.length - 1)},${320 - (d.returns / maxReturns) * 200}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {monthlyData.map((d, i) => (
                      <circle
                        key={`inv-${i}`}
                        cx={(i * 900) / (monthlyData.length - 1)}
                        cy={320 - (d.investments / maxInvestment) * 280}
                        r="4"
                        fill="#10b981"
                      />
                    ))}

                    {monthlyData.map((d, i) => (
                      <circle
                        key={`ret-${i}`}
                        cx={(i * 900) / (monthlyData.length - 1)}
                        cy={320 - (d.returns / maxReturns) * 200}
                        r="4"
                        fill="#3b82f6"
                      />
                    ))}
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    {monthlyData.map((d) => (
                      <span key={d.month}>{d.month}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carbon Credits Over Time */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Carbon Credits Earned</h2>
                <div className="space-y-3">
                  {monthlyData.slice(-6).reverse().map((data, index) => {
                    const percentage = (data.carbonCredits / 143) * 100;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-medium text-gray-600">{data.month}</span>
                        <div className="flex-1">
                          <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-16 text-right text-sm font-bold text-gray-900">
                          {data.carbonCredits}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performers */}
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Top Performing Projects</h2>
                <div className="space-y-4">
                  {topPerformers.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{project.name}</p>
                          <p className="text-sm text-gray-600">Active project</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{project.growth}</p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Portfolio Distribution */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Portfolio Distribution</h3>
                
                {/* Donut Chart Representation */}
                <div className="mb-6">
                  <div className="mx-auto h-48 w-48 rounded-full border-[24px] border-gray-200 relative overflow-hidden" style={{
                    background: `conic-gradient(
                      #eab308 0% ${portfolioDistribution[0].percentage}%,
                      #3b82f6 ${portfolioDistribution[0].percentage}% ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}%,
                      #10b981 ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage}% ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage + portfolioDistribution[2].percentage}%,
                      #a855f7 ${portfolioDistribution[0].percentage + portfolioDistribution[1].percentage + portfolioDistribution[2].percentage}% 100%
                    )`
                  }}>
                    <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                        <p className="text-xs text-gray-600">Diversified</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {portfolioDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{item.percentage}%</p>
                        <p className="text-xs text-gray-500">${item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Risk Assessment</h3>
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Portfolio Risk Level</span>
                    <span className="font-bold text-green-700">Low</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Your portfolio is well-diversified across multiple sustainable sectors with stable returns.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/projects"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                  >
                    Explore Projects
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    href="/wallet"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Manage Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;

