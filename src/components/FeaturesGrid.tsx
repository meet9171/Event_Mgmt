import React from 'react';
import { Calendar, Users, Clock, Bell, Settings, Zap, PieChart, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered scheduling that adapts to your needs',
    gradient: 'from-[#6B46C1] via-[#8B5CF6] to-[#7C3AED]'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time collaboration tools for your entire team',
    gradient: 'from-[#319795] via-[#3AB7BF] to-[#2DD4BF]'
  },
  {
    icon: Clock,
    title: 'Time Management',
    description: 'Efficient timeline planning and execution',
    gradient: 'from-[#FF6B6B] via-[#FF8787] to-[#FF5151]'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay updated with intelligent alerts',
    gradient: 'from-[#6B46C1] via-[#319795] to-[#2DD4BF]'
  },
  {
    icon: Settings,
    title: 'Custom Workflows',
    description: 'Create and automate your perfect workflow',
    gradient: 'from-[#FF6B6B] via-[#FF8787] to-[#FF5151]'
  },
  {
    icon: Zap,
    title: 'Instant Analytics',
    description: 'Real-time insights and reporting',
    gradient: 'from-[#319795] via-[#3AB7BF] to-[#2DD4BF]'
  },
  {
    icon: PieChart,
    title: 'Budget Tracking',
    description: 'Keep your finances in check effortlessly',
    gradient: 'from-[#6B46C1] via-[#8B5CF6] to-[#7C3AED]'
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Enterprise-grade security for your events',
    gradient: 'from-[#FF6B6B] via-[#FF8787] to-[#FF5151]'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Manage events across multiple locations',
    gradient: 'from-[#319795] via-[#3AB7BF] to-[#2DD4BF]'
  }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-24  bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of tools designed to make your event management experience seamless and efficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                style={{ height: '240px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                     style={{ backgroundImage: `linear-gradient(to bottom right, #6B46C1, #319795)` }} />
                
                <div className="relative h-full p-8 flex flex-col">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#6B46C1] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[#6B46C1] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-medium">Learn more</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};