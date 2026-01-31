'use client';

import React, { useState, useCallback } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = React.memo(() => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: 'What is micro-investing?',
      answer: 'Micro-investing allows you to invest small amounts of money in sustainable projects. You can start with as little as you want, making green investments accessible to everyone regardless of your budget. Each micro-investment contributes to larger environmental initiatives that create real impact.'
    },
    {
      id: 2,
      question: 'How do environmental projects get verified?',
      answer: 'All projects on our platform undergo rigorous third-party verification and certification processes. We work with certified environmental auditors and sustainability experts to ensure every project meets strict ecological standards and delivers measurable environmental benefits.'
    },
    {
      id: 3,
      question: 'How do users track their carbon impact?',
      answer: 'Our platform provides real-time tracking dashboards where you can monitor the carbon offset and environmental impact of your investments. You\'ll receive detailed reports showing metrics like CO2 reduction, trees planted, renewable energy generated, and more.'
    },
    {
      id: 4,
      question: 'What types of projects can I invest in?',
      answer: 'We offer diverse sustainable investment opportunities including solar and wind energy projects, reforestation initiatives, clean water programs, sustainable agriculture, green building developments, and carbon offset programs. Each project is carefully vetted for environmental and social impact.'
    },
    {
      id: 5,
      question: 'Is my investment secure?',
      answer: 'Yes, we prioritize investment security through regulated financial partnerships, transparent reporting, and secure payment processing. All investments are protected by industry-standard security measures, and we provide full transparency on project performance and returns.'
    },
    {
      id: 6,
      question: 'How do I get started with green investing?',
      answer: 'Getting started is simple: create a free account, browse our verified eco-projects, choose investments that align with your values, and start making a difference. Our platform guides you through each step, and our support team is always available to help.'
    }
  ];

  const toggleAccordion = useCallback((index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
    <section
      id="faq"
      className="w-full bg-gradient-to-b from-white to-gray-50 px-6 py-20 md:py-28"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have questions about sustainable investing? Find answers to the most 
            common questions our community asks.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4" role="list">
          {faqData.map((faq, index) => (
            <article
              key={faq.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              role="listitem"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                
                {/* Icon - Plus/Minus */}
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 transition-all duration-300"
                  aria-hidden="true"
                >
                  {openIndex === index ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 12h12"></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 6v12M6 12h12"></path>
                    </svg>
                  )}
                </span>
              </button>

              {/* Answer */}
              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-gray-100 px-6 py-5">
                  <p className="leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="inline-block rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;

