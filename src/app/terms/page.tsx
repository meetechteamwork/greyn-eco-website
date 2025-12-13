'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              <p className="leading-relaxed text-gray-700">
                By accessing and using the Greyn Eco Front platform ("Platform"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Description of Service</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Greyn Eco Front provides a platform for sustainable micro-investments in environmentally focused projects. Our services include:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Access to vetted sustainable investment opportunities</li>
                <li>Portfolio management and tracking tools</li>
                <li>Carbon credit tokenization and tracking</li>
                <li>Investment returns and impact reporting</li>
                <li>Community features for sustainable investors</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">3. User Eligibility</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                To use our Platform, you must:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not be prohibited from using our services under applicable law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Account Registration and Security</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You are responsible for:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring your account information remains accurate and current</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Investment Terms</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                By investing through our Platform:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>You acknowledge that all investments carry risk</li>
                <li>Past performance does not guarantee future results</li>
                <li>Projected returns are estimates, not guarantees</li>
                <li>You are responsible for your investment decisions</li>
                <li>Investments may be subject to lock-up periods</li>
                <li>Early withdrawal may result in penalties or fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Carbon Credits and Tokens</h2>
              <p className="leading-relaxed text-gray-700">
                Carbon credits earned through investments are represented as digital tokens. These tokens represent verified carbon offset credits and may be subject to market fluctuations. Token ownership and transferability are governed by blockchain protocols and applicable regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Fees and Payments</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our Platform may charge fees for:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Platform usage and maintenance</li>
                <li>Transaction processing</li>
                <li>Withdrawal and transfer services</li>
                <li>Premium features and services</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                All fees will be clearly disclosed before you complete any transaction. Fees are subject to change with notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Prohibited Activities</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You agree not to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Use the Platform for any illegal purpose</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Attempt to manipulate or exploit the Platform</li>
                <li>Interfere with other users' access or use</li>
                <li>Reverse engineer or copy our technology</li>
                <li>Use automated tools to access the Platform without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Intellectual Property</h2>
              <p className="leading-relaxed text-gray-700">
                All content, features, and functionality on the Platform are owned by Greyn Eco Front and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Disclaimers and Limitation of Liability</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy or reliability of information</li>
                <li>Investment returns or outcomes</li>
                <li>Security against unauthorized access</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">11. Indemnification</h2>
              <p className="leading-relaxed text-gray-700">
                You agree to indemnify and hold harmless Greyn Eco Front, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">12. Dispute Resolution</h2>
              <p className="leading-relaxed text-gray-700">
                Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">13. Governing Law</h2>
              <p className="leading-relaxed text-gray-700">
                These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">14. Termination</h2>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the Platform will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">15. Contact Information</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="rounded-lg bg-green-50 p-6">
                <p className="mb-2 font-semibold text-gray-900">Greyn Eco Front</p>
                <p className="mb-1 text-gray-700">Email: legal@greyn-eco-front.com</p>
                <p className="mb-1 text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: 123 Green Street, Eco City, EC 12345</p>
              </div>
            </section>

            <section className="mb-8">
              <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6">
                <p className="font-semibold text-gray-900">
                  By using the Greyn Eco Front platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;

