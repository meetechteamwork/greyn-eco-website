'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormErrors {
  organizationName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  country?: string;
  city?: string;
  website?: string;
  yearFounded?: string;
  missionStatement?: string;
  organizationType?: string;
  registrationNumber?: string;
  certificationFile?: string;
  address?: string;
  proofOfWork?: string;
}

const ENGOSignupPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    city: '',
    website: '',
    yearFounded: '',
    missionStatement: '',
    organizationType: '',
    registrationNumber: '',
    certificationFile: null as File | null,
    address: '',
    proofOfWork: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, certificationFile: 'Please upload a PDF, JPG, or PNG file' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, certificationFile: 'File size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, certificationFile: file }));
      setErrors(prev => ({ ...prev, certificationFile: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (!formData.yearFounded) {
      newErrors.yearFounded = 'Year founded is required';
    } else {
      const year = parseInt(formData.yearFounded);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.yearFounded = 'Please enter a valid year';
      }
    }

    if (!formData.missionStatement.trim()) {
      newErrors.missionStatement = 'Mission statement is required';
    } else if (formData.missionStatement.trim().length < 50) {
      newErrors.missionStatement = 'Mission statement must be at least 50 characters';
    }

    if (!formData.organizationType) {
      newErrors.organizationType = 'Organization type is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.certificationFile) {
      newErrors.certificationFile = 'Government certification is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.proofOfWork.trim()) {
      newErrors.proofOfWork = 'Proof of work description is required';
    } else if (formData.proofOfWork.trim().length < 100) {
      newErrors.proofOfWork = 'Proof of work must be at least 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert('ENGO registration submitted successfully! Your application will be reviewed.');
      setIsLoading(false);
      router.push('/auth/engo/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-8 md:py-12 relative overflow-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="fixed top-6 left-4 md:top-8 md:left-8 z-10 flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm"
      >
        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span className="font-semibold text-sm md:text-base">Back to Home</span>
      </Link>

      {/* Main Form Container */}
      <div className="relative w-full max-w-4xl my-8 md:my-12">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-visible">
          {/* Decorative Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
          
          <div className="p-6 md:p-8 lg:p-10 pb-8 md:pb-10 lg:pb-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-4 shadow-lg">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="6" width="6" height="4" fill="white" />
                  <rect x="11" y="6" width="6" height="4" fill="white" />
                  <rect x="18" y="6" width="6" height="4" fill="white" />
                  <rect x="7.5" y="11" width="6" height="4" fill="white" />
                  <rect x="14.5" y="11" width="6" height="4" fill="white" />
                  <rect x="4" y="16" width="6" height="4" fill="white" />
                  <rect x="11" y="16" width="6" height="4" fill="white" />
                  <rect x="18" y="16" width="6" height="4" fill="white" />
                  <rect x="7.5" y="21" width="6" height="4" fill="white" />
                  <rect x="14.5" y="21" width="6" height="4" fill="white" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Register as ENGO</h1>
              <p className="text-gray-600">Join Greyn Eco as an Environmental Non-Governmental Organization</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Organization Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="organizationName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.organizationName
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="Green Earth Foundation"
                      required
                    />
                    {errors.organizationName && (
                      <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="contact@organization.org"
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.country
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="United States"
                      required
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.city
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="San Francisco"
                      required
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.website
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="https://www.organization.org"
                      required
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                    )}
                  </div>

                  {/* Year Founded */}
                  <div>
                    <label htmlFor="yearFounded" className="block text-sm font-semibold text-gray-700 mb-2">
                      Year Founded *
                    </label>
                    <input
                      type="number"
                      id="yearFounded"
                      name="yearFounded"
                      value={formData.yearFounded}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.yearFounded
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="2020"
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                    {errors.yearFounded && (
                      <p className="mt-1 text-sm text-red-600">{errors.yearFounded}</p>
                    )}
                  </div>

                  {/* Organization Type */}
                  <div>
                    <label htmlFor="organizationType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Type *
                    </label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.organizationType
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      required
                    >
                      <option value="">Select organization type</option>
                      <option value="NGO">NGO</option>
                      <option value="INGO">INGO</option>
                      <option value="Non-profit">Non-profit</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                    {errors.organizationType && (
                      <p className="mt-1 text-sm text-red-600">{errors.organizationType}</p>
                    )}
                  </div>

                  {/* Mission Statement */}
                  <div className="md:col-span-2">
                    <label htmlFor="missionStatement" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mission Statement *
                    </label>
                    <textarea
                      id="missionStatement"
                      name="missionStatement"
                      value={formData.missionStatement}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none resize-none ${
                        errors.missionStatement
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="Describe your organization's mission and goals..."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.missionStatement.length}/50 minimum characters
                    </p>
                    {errors.missionStatement && (
                      <p className="mt-1 text-sm text-red-600">{errors.missionStatement}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Registration Number */}
                  <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.registrationNumber
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="ENGO-2024-001"
                      required
                    />
                    {errors.registrationNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                    )}
                  </div>

                  {/* Government Certification Upload */}
                  <div>
                    <label htmlFor="certificationFile" className="block text-sm font-semibold text-gray-700 mb-2">
                      Government Certification *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="certificationFile"
                        name="certificationFile"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 ${
                          errors.certificationFile
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                        }`}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                    {errors.certificationFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.certificationFile}</p>
                    )}
                    {formData.certificationFile && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.certificationFile.name}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                        errors.address
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="123 Main Street, Suite 100"
                      required
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  {/* Proof of Work */}
                  <div className="md:col-span-2">
                    <label htmlFor="proofOfWork" className="block text-sm font-semibold text-gray-700 mb-2">
                      Proof of Work / Past Projects Description *
                    </label>
                    <textarea
                      id="proofOfWork"
                      name="proofOfWork"
                      value={formData.proofOfWork}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none resize-none ${
                        errors.proofOfWork
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                      placeholder="Describe your past projects, achievements, and impact..."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.proofOfWork.length}/100 minimum characters
                    </p>
                    {errors.proofOfWork && (
                      <p className="mt-1 text-sm text-red-600">{errors.proofOfWork}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Register as ENGO
                      <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/engo/login"
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ENGOSignupPage;


