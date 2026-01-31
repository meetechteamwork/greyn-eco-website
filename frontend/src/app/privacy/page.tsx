'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Introduction</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Welcome to Greyn Eco Front ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sustainable investment platform.
              </p>
              <p className="leading-relaxed text-gray-700">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Information We Collect</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Financial information necessary for investment transactions</li>
                <li>Account credentials and authentication information</li>
                <li>Investment preferences and portfolio information</li>
                <li>Communication preferences and correspondence with us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Process and manage your investments in sustainable projects</li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>Send you updates about your investments and carbon credits</li>
                <li>Improve our platform and develop new features</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may share your information in the following circumstances:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>With service providers who assist in our operations</li>
                <li>With project partners for investment verification</li>
                <li>With financial institutions for payment processing</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Data Security</h2>
              <p className="leading-relaxed text-gray-700">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Your Privacy Rights</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability rights</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed text-gray-700">
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">8. International Data Transfers</h2>
              <p className="leading-relaxed text-gray-700">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Children's Privacy</h2>
              <p className="leading-relaxed text-gray-700">
                Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">11. Contact Us</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="rounded-lg bg-green-50 p-6">
                <p className="mb-2 font-semibold text-gray-900">Greyn Eco Front</p>
                <p className="mb-1 text-gray-700">Email: privacy@greyn-eco-front.com</p>
                <p className="mb-1 text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: 123 Green Street, Eco City, EC 12345</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;

