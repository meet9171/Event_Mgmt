import React from 'react';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Plan',
    description: 'Set up your event details and requirements'
  },
  {
    number: 2,
    title: 'Organize',
    description: 'Coordinate with team and vendors'
  },
  {
    number: 3,
    title: 'Execute',
    description: 'Run your event smoothly with our tools'
  },
  {
    number: 4,
    title: 'Analyze',
    description: 'Get insights and improve future events'
  }
];

export const ProcessTimeline = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          How It all works together ?
        </h2>

        <div className="hidden md:grid grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          {/* <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" /> */}

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[#319795] text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#319795] text-white flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">{step.number}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};