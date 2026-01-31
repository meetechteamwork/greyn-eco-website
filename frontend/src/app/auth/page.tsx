'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

type UserRole = 'simple-user' | 'ngo' | 'corporate' | 'admin';

interface RoleConfig {
  name: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  loginTitle: string;
  loginSubtitle: string;
  signupTitle: string;
  signupSubtitle: string;
  redirectPath: string;
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  'simple-user': {
    name: 'simple-user',
    label: 'Investor',
    icon: (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    loginTitle: 'Welcome Back, Investor!',
    loginSubtitle: 'Login to your Greyn Eco account',
    signupTitle: 'Start Your Investment Journey',
    signupSubtitle: 'Join Greyn Eco and start investing in sustainability',
    redirectPath: '/dashboard'
  },
  'ngo': {
    name: 'ngo',
    label: 'NGO',
    icon: (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    ),
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    loginTitle: 'Welcome Back, NGO Partner!',
    loginSubtitle: 'Access your NGO portal',
    signupTitle: 'Register Your NGO',
    signupSubtitle: 'Join our network of environmental organizations',
    redirectPath: '/ngo/dashboard'
  },
  'corporate': {
    name: 'corporate',
    label: 'Corporate',
    icon: (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
    ),
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    loginTitle: 'Welcome Back, Corporate Partner!',
    loginSubtitle: 'Access your Corporate ESG portal',
    signupTitle: 'Register Your Company',
    signupSubtitle: 'Join our corporate sustainability network',
    redirectPath: '/corporate/dashboard'
  },
  'admin': {
    name: 'admin',
    label: 'Admin',
    icon: (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    ),
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    loginTitle: 'Admin Portal Access',
    loginSubtitle: 'Secure administrator login',
    signupTitle: 'Admin Registration',
    signupSubtitle: 'Request admin access (requires approval)',
    redirectPath: '/admin/overview'
  }
};

const AuthPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('simple-user');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();
  const { login, signup, isAuthenticated, user } = useAuth();

  // Note: Removed automatic redirect for authenticated users
  // Users will always see the login page when visiting /auth
  // They can still manually navigate to dashboard after login

  // Check URL parameters for action and role
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const roleParam = params.get('role');
    
    if (roleParam === 'simple-user' || roleParam === 'investor') {
      setSelectedRole('simple-user');
    } else if (roleParam === 'ngo') {
      setSelectedRole('ngo');
    } else if (roleParam === 'corporate') {
      setSelectedRole('corporate');
    } else if (roleParam === 'admin') {
      setSelectedRole('admin');
    }
  }, []);

  const currentConfig = roleConfigs[selectedRole];

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    adminCode: '' // For admin only
  });

  // Signup form state - dynamic based on role
  const [signupData, setSignupData] = useState({
    // Simple user
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    // NGO
    organizationName: '',
    registrationNumber: '',
    contactPerson: '',
    ngoEmail: '',
    ngoPassword: '',
    ngoConfirmPassword: '',
    // Corporate
    companyName: '',
    taxId: '',
    corporateContactPerson: '',
    corporateEmail: '',
    corporatePassword: '',
    corporateConfirmPassword: '',
    // Admin
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminConfirmPassword: '',
    adminCode: '',
    adminAgreeToTerms: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare credentials based on role
      const credentials: any = {
        email: loginData.email,
        password: loginData.password
      };

      // Add admin code if admin role
      if (selectedRole === 'admin') {
        credentials.adminCode = loginData.adminCode;
      }

      // Call login API
      const result = await login(selectedRole, credentials);

      if (result.success) {
        setSuccess(result.message || 'Login successful!');
        // Redirect to appropriate dashboard
        setTimeout(() => {
          router.replace(currentConfig.redirectPath);
        }, 500);
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    let errorMessage = '';

    if (selectedRole === 'simple-user') {
      if (signupData.password !== signupData.confirmPassword) {
        isValid = false;
        errorMessage = 'Passwords do not match!';
      } else if (!signupData.agreeToTerms) {
        isValid = false;
        errorMessage = 'Please agree to the Terms and Conditions';
      }
    } else if (selectedRole === 'ngo') {
      if (signupData.ngoPassword !== signupData.ngoConfirmPassword) {
        isValid = false;
        errorMessage = 'Passwords do not match!';
      }
    } else if (selectedRole === 'corporate') {
      if (signupData.corporatePassword !== signupData.corporateConfirmPassword) {
        isValid = false;
        errorMessage = 'Passwords do not match!';
      }
    } else if (selectedRole === 'admin') {
      if (signupData.adminPassword !== signupData.adminConfirmPassword) {
        isValid = false;
        errorMessage = 'Passwords do not match!';
      } else if (!signupData.adminCode) {
        isValid = false;
        errorMessage = 'Admin code is required!';
      } else if (!signupData.adminAgreeToTerms) {
        isValid = false;
        errorMessage = 'Please agree to the Terms and Conditions';
      }
    }

    if (!isValid) {
      setError(errorMessage);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare signup data based on role
      let signupPayload: any;

      if (selectedRole === 'simple-user') {
        signupPayload = {
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword
        };
      } else if (selectedRole === 'ngo') {
        signupPayload = {
          organizationName: signupData.organizationName,
          registrationNumber: signupData.registrationNumber,
          contactPerson: signupData.contactPerson,
          email: signupData.ngoEmail,
          password: signupData.ngoPassword,
          confirmPassword: signupData.ngoConfirmPassword
        };
      } else if (selectedRole === 'corporate') {
        signupPayload = {
          companyName: signupData.companyName,
          taxId: signupData.taxId,
          contactPerson: signupData.corporateContactPerson,
          email: signupData.corporateEmail,
          password: signupData.corporatePassword,
          confirmPassword: signupData.corporateConfirmPassword
        };
      } else if (selectedRole === 'admin') {
        signupPayload = {
          name: signupData.adminName,
          email: signupData.adminEmail,
          password: signupData.adminPassword,
          confirmPassword: signupData.adminConfirmPassword,
          adminCode: signupData.adminCode
        };
      }

      // Call signup API
      const result = await signup(selectedRole, signupPayload);

      if (result.success) {
        setSuccess(result.message || 'Registration successful!');
        
        // Check if user was logged in immediately (has token)
        // @ts-ignore - loggedIn property from signup result
        if (result.loggedIn) {
          // User is authenticated, redirect to dashboard immediately
          setIsLoading(false);
          setTimeout(() => {
            router.replace(currentConfig.redirectPath);
          }, 500);
        } else {
          // No immediate login (shouldn't happen now, but handle gracefully)
          setIsFlipped(false);
          setIsLoading(false);
          setSuccess('Registration successful! Please login with your credentials.');
        }
      } else {
        setError(result.message || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setIsLoading(false);
    }
  };

  const getBackgroundGradient = () => {
    switch (selectedRole) {
      case 'simple-user':
        return 'from-green-50 via-emerald-50 to-teal-50';
      case 'ngo':
        return 'from-emerald-50 via-green-50 to-teal-50';
      case 'corporate':
        return 'from-blue-50 via-indigo-50 to-purple-50';
      case 'admin':
        return 'from-red-50 via-rose-50 to-pink-50';
      default:
        return 'from-green-50 via-emerald-50 to-teal-50';
    }
  };

  const getButtonGradient = () => {
    switch (selectedRole) {
      case 'simple-user':
        return 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      case 'ngo':
        return 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700';
      case 'corporate':
        return 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
      case 'admin':
        return 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';
      default:
        return 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
    }
  };

  const getTextColor = () => {
    switch (selectedRole) {
      case 'simple-user':
        return 'text-green-600 hover:text-green-700';
      case 'ngo':
        return 'text-emerald-600 hover:text-emerald-700';
      case 'corporate':
        return 'text-blue-600 hover:text-blue-700';
      case 'admin':
        return 'text-red-600 hover:text-red-700';
      default:
        return 'text-green-600 hover:text-green-700';
    }
  };

  const getFocusColor = () => {
    switch (selectedRole) {
      case 'simple-user':
        return 'focus:border-green-500 focus:ring-green-200';
      case 'ngo':
        return 'focus:border-emerald-500 focus:ring-emerald-200';
      case 'corporate':
        return 'focus:border-blue-500 focus:ring-blue-200';
      case 'admin':
        return 'focus:border-red-500 focus:ring-red-200';
      default:
        return 'focus:border-green-500 focus:ring-green-200';
    }
  };

  return (
    <div className={`min-h-screen flex items-start sm:items-center justify-center bg-gradient-to-br ${getBackgroundGradient()} px-4 py-6 sm:py-8 md:py-12 relative overflow-auto`}>
      {/* Animated Background Elements - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Decorative Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-10 right-20 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#1a4d2e" strokeWidth="2" />
          <path d="M50 20 L50 80 M20 50 L80 50" stroke="#1a4d2e" strokeWidth="2" />
        </svg>
      </div>
      <div className="hidden md:block absolute bottom-10 left-20 opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="10" width="60" height="60" stroke="#1a4d2e" strokeWidth="2" transform="rotate(45 40 40)" />
        </svg>
      </div>

      {/* Main Card Container with 3D Flip Effect */}
      <div className="relative h-full w-full max-w-md my-8 sm:my-0" style={{ perspective: '1000px' }}>
        {/* Role Selector */}
        <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
              const config = roleConfigs[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setIsFlipped(false); // Reset to login when changing role
                    setError(''); // Clear error messages
                    setSuccess(''); // Clear success messages
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-md scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {config.icon}
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`relative w-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* LOGIN CARD - Front */}
          <div
            className="relative w-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Header Gradient */}
              <div className={`h-2 bg-gradient-to-r ${currentConfig.gradient}`}></div>
              
              <div className="p-6 sm:p-8 md:p-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <Image
                      src="/GREYN Logo.png"
                      alt="GREYN Logo"
                      width={180}
                      height={60}
                      className="h-16 w-auto"
                      priority
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentConfig.loginTitle}</h1>
                  <p className="text-gray-600">{currentConfig.loginSubtitle}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Admin Code (Admin only) */}
                  {selectedRole === 'admin' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Admin Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={loginData.adminCode}
                          onChange={(e) => setLoginData({ ...loginData, adminCode: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                          placeholder="Enter admin code"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {selectedRole === 'admin' ? 'Admin Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                        placeholder={selectedRole === 'admin' ? 'admin@greyn.eco' : 'john@example.com'}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                        className={`w-4 h-4 ${selectedRole === 'simple-user' ? 'text-green-600' : selectedRole === 'ngo' ? 'text-emerald-600' : selectedRole === 'corporate' ? 'text-blue-600' : 'text-red-600'} border-gray-300 rounded focus:ring-2 focus:ring-offset-0`}
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <button type="button" className={`text-sm font-semibold ${getTextColor()} transition-colors whitespace-nowrap`}>
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${getButtonGradient()} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8"></div>
                <p className="text-center text-sm sm:text-base text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsFlipped(true)}
                    className={`font-bold ${getTextColor()} transition-colors`}
                  >
                    Sign Up
                  </button>
                </p>

                {/* How It Works Section */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-200">
                  <p className="mb-3 text-center text-sm font-medium text-gray-700">
                    Not sure how it works?
                  </p>
                  <Link
                    href={`/how-it-works?role=${selectedRole}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border-2 border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-green-500 hover:text-green-600 hover:shadow-md"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNUP CARD - Back */}
          <div
            className="absolute top-0 left-0 w-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Header Gradient */}
              <div className={`h-2 bg-gradient-to-r ${currentConfig.gradient}`}></div>
              
              <div className="p-6 sm:p-8 md:p-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <Image
                      src="/GREYN Logo.png"
                      alt="GREYN Logo"
                      width={180}
                      height={60}
                      className="h-16 w-auto"
                      priority
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentConfig.signupTitle}</h1>
                  <p className="text-gray-600">{currentConfig.signupSubtitle}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Simple User Form */}
                  {selectedRole === 'simple-user' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-start cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={signupData.agreeToTerms}
                            onChange={(e) => setSignupData({ ...signupData, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            required
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            I agree to the{' '}
                            <Link href="/terms" className={`font-semibold ${getTextColor()}`}>
                              Terms and Conditions
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className={`font-semibold ${getTextColor()}`}>
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* NGO Form */}
                  {selectedRole === 'ngo' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Organization Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.organizationName}
                            onChange={(e) => setSignupData({ ...signupData, organizationName: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="Green Earth Foundation"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Registration Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.registrationNumber}
                            onChange={(e) => setSignupData({ ...signupData, registrationNumber: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="NGO-2024-001"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.contactPerson}
                            onChange={(e) => setSignupData({ ...signupData, contactPerson: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={signupData.ngoEmail}
                            onChange={(e) => setSignupData({ ...signupData, ngoEmail: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="contact@ngo.org"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.ngoPassword}
                            onChange={(e) => setSignupData({ ...signupData, ngoPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.ngoConfirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, ngoConfirmPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Corporate Form */}
                  {selectedRole === 'corporate' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Company Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.companyName}
                            onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="Acme Corporation"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tax ID / Registration Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.taxId}
                            onChange={(e) => setSignupData({ ...signupData, taxId: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="TAX-123456789"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.corporateContactPerson}
                            onChange={(e) => setSignupData({ ...signupData, corporateContactPerson: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="Jane Smith"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={signupData.corporateEmail}
                            onChange={(e) => setSignupData({ ...signupData, corporateEmail: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="contact@company.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.corporatePassword}
                            onChange={(e) => setSignupData({ ...signupData, corporatePassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.corporateConfirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, corporateConfirmPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Admin Form */}
                  {selectedRole === 'admin' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.adminName}
                            onChange={(e) => setSignupData({ ...signupData, adminName: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="Admin Name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Admin Code
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={signupData.adminCode}
                            onChange={(e) => setSignupData({ ...signupData, adminCode: e.target.value.trim() })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="ADMIN-CODE-XXXX"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                          </div>
                          <input
                            type="email"
                            value={signupData.adminEmail}
                            onChange={(e) => setSignupData({ ...signupData, adminEmail: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="admin@greyn.eco"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.adminPassword}
                            onChange={(e) => setSignupData({ ...signupData, adminPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={signupData.adminConfirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, adminConfirmPassword: e.target.value })}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getFocusColor()} transition-all outline-none`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-start cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={signupData.adminAgreeToTerms}
                            onChange={(e) => setSignupData({ ...signupData, adminAgreeToTerms: e.target.checked })}
                            className="w-4 h-4 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            required
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            I agree to the{' '}
                            <Link href="/terms" className={`font-semibold ${getTextColor()}`}>
                              Terms and Conditions
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className={`font-semibold ${getTextColor()}`}>
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Signup Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${getButtonGradient()} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-8"></div>
                <p className="text-center text-sm sm:text-base text-gray-600 pb-2 sm:pb-0">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsFlipped(false)}
                    className={`font-bold ${getTextColor()} transition-colors`}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
