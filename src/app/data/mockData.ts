// Mock data for the Greyn Eco platform
// This file contains placeholder data until MongoDB integration

export interface Project {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  carbonImpact: string;
  image: string;
  description: string;
  longDescription: string;
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  duration: string;
  location: string;
  carbonCreditsPerHundred: number;
  investorCount: number;
  startDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  totalInvested: number;
  projectsCount: number;
  verified: boolean;
  location: string;
  phone?: string;
  bio?: string;
  memberSince?: string;
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  projectName: string;
  amount: number;
  returns: number;
  carbonCredits: number;
  status: 'active' | 'pending' | 'completed';
  date: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// Projects Data
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Amazon Rainforest Reforestation',
    category: 'Reforestation',
    status: 'active',
    carbonImpact: '500 tons CO₂/year',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    description: 'Plant 10,000 native trees in the Amazon rainforest',
    longDescription: 'This project aims to restore 250 hectares of degraded Amazon rainforest by planting 10,000 native tree species. The initiative will create wildlife corridors, restore ecosystem services, and sequester significant amounts of carbon dioxide.',
    fundingGoal: 100000,
    currentFunding: 75000,
    minInvestment: 50,
    duration: '10 years',
    location: 'Amazon Basin, Brazil',
    carbonCreditsPerHundred: 2.5,
    investorCount: 142,
    startDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Solar Energy Farm - California',
    category: 'Solar Energy',
    status: 'active',
    carbonImpact: '800 tons CO₂/year',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
    description: 'Build a 5MW solar farm to power 1,200 homes',
    longDescription: 'A state-of-the-art 5 megawatt solar energy installation that will generate clean electricity for approximately 1,200 homes annually.',
    fundingGoal: 250000,
    currentFunding: 180000,
    minInvestment: 100,
    duration: '25 years',
    location: 'California, USA',
    carbonCreditsPerHundred: 3.2,
    investorCount: 215,
    startDate: '2024-02-01'
  },
  {
    id: '3',
    name: 'Wind Power Initiative - Texas',
    category: 'Wind Energy',
    status: 'active',
    carbonImpact: '1,200 tons CO₂/year',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1200&q=80',
    description: 'Install 10 wind turbines generating clean energy',
    longDescription: 'Deploy 10 modern wind turbines in the Texas wind corridor, generating clean renewable energy for thousands of homes.',
    fundingGoal: 500000,
    currentFunding: 420000,
    minInvestment: 150,
    duration: '20 years',
    location: 'Texas, USA',
    carbonCreditsPerHundred: 4.0,
    investorCount: 387,
    startDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Ocean Cleanup Initiative',
    category: 'Ocean Conservation',
    status: 'pending',
    carbonImpact: '300 tons plastic removed',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
    description: 'Remove plastic waste from Pacific Ocean regions',
    longDescription: 'Deploy advanced cleanup technology to remove plastic waste from critical Pacific Ocean regions.',
    fundingGoal: 150000,
    currentFunding: 95000,
    minInvestment: 75,
    duration: '5 years',
    location: 'Pacific Ocean',
    carbonCreditsPerHundred: 2.0,
    investorCount: 98,
    startDate: '2024-03-01'
  },
  {
    id: '5',
    name: 'Urban Green Rooftop Gardens',
    category: 'Urban Sustainability',
    status: 'active',
    carbonImpact: '150 tons CO₂/year',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80',
    description: 'Convert 50 city rooftops into green gardens',
    longDescription: 'Transform urban rooftops into productive green spaces that reduce urban heat islands, improve air quality, and provide local food production.',
    fundingGoal: 80000,
    currentFunding: 62000,
    minInvestment: 50,
    duration: '7 years',
    location: 'New York City, USA',
    carbonCreditsPerHundred: 1.5,
    investorCount: 76,
    startDate: '2024-02-15'
  },
  {
    id: '6',
    name: 'Electric Vehicle Charging Network',
    category: 'Clean Transportation',
    status: 'pending',
    carbonImpact: '650 tons CO₂/year',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80',
    description: 'Install 200 EV charging stations across major cities',
    longDescription: 'Build a comprehensive network of 200 electric vehicle charging stations across major metropolitan areas.',
    fundingGoal: 300000,
    currentFunding: 245000,
    minInvestment: 100,
    duration: '15 years',
    location: 'Multiple Cities, USA',
    carbonCreditsPerHundred: 2.8,
    investorCount: 189,
    startDate: '2024-03-10'
  }
];

// Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'investor',
    status: 'active',
    joinDate: '2024-01-15',
    totalInvested: 5500,
    projectsCount: 4,
    verified: true,
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about sustainable investing and environmental conservation.',
    memberSince: 'January 2024'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'investor',
    status: 'active',
    joinDate: '2024-02-20',
    totalInvested: 12000,
    projectsCount: 7,
    verified: true,
    location: 'New York, NY'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'investor',
    status: 'active',
    joinDate: '2024-01-08',
    totalInvested: 8700,
    projectsCount: 5,
    verified: true,
    location: 'Los Angeles, CA'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@greyneco.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-11-01',
    totalInvested: 0,
    projectsCount: 0,
    verified: true,
    location: 'Austin, TX'
  }
];

// Investments Data
export const mockInvestments: Investment[] = [
  {
    id: '1',
    userId: '1',
    projectId: '1',
    projectName: 'Amazon Rainforest Reforestation',
    amount: 1000,
    returns: 125,
    carbonCredits: 25,
    status: 'active',
    date: '2024-01-14'
  },
  {
    id: '2',
    userId: '1',
    projectId: '2',
    projectName: 'Solar Energy Farm - California',
    amount: 2500,
    returns: 375,
    carbonCredits: 80,
    status: 'active',
    date: '2024-01-12'
  },
  {
    id: '3',
    userId: '1',
    projectId: '3',
    projectName: 'Wind Power Initiative - Texas',
    amount: 1500,
    returns: 213,
    carbonCredits: 60,
    status: 'active',
    date: '2024-01-08'
  },
  {
    id: '4',
    userId: '1',
    projectId: '6',
    projectName: 'Electric Vehicle Charging Network',
    amount: 500,
    returns: 82.50,
    carbonCredits: 14,
    status: 'pending',
    date: '2024-01-05'
  }
];

// Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'deposit',
    amount: 5000,
    description: 'Bank transfer deposit',
    date: '2025-01-15',
    status: 'completed'
  },
  {
    id: '2',
    userId: '1',
    type: 'investment',
    amount: -1000,
    description: 'Amazon Rainforest Reforestation',
    date: '2025-01-14',
    status: 'completed'
  },
  {
    id: '3',
    userId: '1',
    type: 'investment',
    amount: -2500,
    description: 'Solar Energy Farm - California',
    date: '2025-01-12',
    status: 'completed'
  },
  {
    id: '4',
    userId: '1',
    type: 'return',
    amount: 125,
    description: 'Return from Amazon Reforestation',
    date: '2025-01-10',
    status: 'completed'
  },
  {
    id: '5',
    userId: '1',
    type: 'investment',
    amount: -1500,
    description: 'Wind Power Initiative - Texas',
    date: '2025-01-08',
    status: 'completed'
  }
];

// Platform Statistics
export const mockPlatformStats = {
  totalUsers: 1247,
  totalProjects: 24,
  totalInvestments: 2547890,
  activeProjects: 18,
  pendingProjects: 4,
  completedProjects: 2,
  totalCarbonCredits: 15847.5,
  newUsersThisMonth: 143,
  investmentGrowth: '+23.5%',
  platformRevenue: 127394.50
};

// Helper functions to get data
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getInvestmentsByUserId = (userId: string): Investment[] => {
  return mockInvestments.filter(i => i.userId === userId);
};

export const getTransactionsByUserId = (userId: string): Transaction[] => {
  return mockTransactions.filter(t => t.userId === userId);
};

export const getProjectsByStatus = (status: string): Project[] => {
  if (status === 'all') return mockProjects;
  return mockProjects.filter(p => p.status === status);
};

export const getUsersByRole = (role: string): User[] => {
  if (role === 'all') return mockUsers;
  return mockUsers.filter(u => u.role === role);
};

