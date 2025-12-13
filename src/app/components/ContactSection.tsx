'use client';

import React, { useState, useCallback } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC = React.memo(() => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will go here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  }, [formData]);

  const handleFocus = useCallback((field: string) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 px-6 py-20 md:py-28"
      aria-label="Contact section"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-green-200 opacity-20 blur-3xl"></div>
      <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-green-300 opacity-20 blur-3xl"></div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Get In Touch
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have questions about sustainable investing? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            {/* Email Card */}
            <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Email Us</h3>
              <p className="text-gray-600">info@greyn-eco-front.com</p>
            </div>

            {/* Phone Card */}
            <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            {/* Location Card */}
            <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Visit Us</h3>
              <p className="text-gray-600">123 Green Street, Eco City, EC 12345</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-8 shadow-2xl md:p-10"
              noValidate
            >
              <div className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        className={`h-5 w-5 transition-colors duration-200 ${
                          focusedField === 'name' ? 'text-green-600' : 'text-gray-400'
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100"
                      placeholder="John Doe"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        className={`h-5 w-5 transition-colors duration-200 ${
                          focusedField === 'email' ? 'text-green-600' : 'text-gray-400'
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100"
                      placeholder="john@example.com"
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-0 top-0 flex pt-4 pl-4">
                      <svg
                        className={`h-5 w-5 transition-colors duration-200 ${
                          focusedField === 'message' ? 'text-green-600' : 'text-gray-400'
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      rows={5}
                      className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-100"
                      placeholder="Tell us about your sustainable investment goals..."
                      required
                      aria-required="true"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <svg
                      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  <span className="absolute inset-0 -z-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;

