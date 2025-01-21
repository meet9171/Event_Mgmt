import React from 'react';
import { LayoutDashboard, UserPlus, QrCode, Palette } from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Organizer Dashboard',
    description: 'Centralized tools for event creation, attendee insights, and real-time analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    color: 'from-[#6B46C1] to-[#5B3AA8]'
  },
  {
    icon: UserPlus,
    title: 'User Registration',
    description: 'Streamlined registration with social logins and automatic QR code generation for attendees.',
    image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    color: 'from-[#319795] to-[#2C7A7B]'
  },
  {
    icon: QrCode,
    title: 'Check-In/Check-Out',
    description: 'Real-time QR-based tracking system with instant notifications and attendance monitoring.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    color: 'from-[#FF6B6B] to-[#FF5151]'
  },
  {
    icon: Palette,
    title: 'Dynamic Badge Design',
    description: 'AI-powered badge customization with professional templates and bulk export capabilities.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    color: 'from-[#6B46C1] to-[#319795]'
  }
];

export const KeyFeatures = () => {
  return (
    <section className="py-24 bg-gray-50" id="key-features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Tools for Seamless Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next generation of event management with our cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="absolute inset-0">
                  {/* <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  /> */}
                </div>
                
                <div className="relative p-8 flex flex-col min-h-[400px]">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#6B46C1] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 mb-8 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button className={`bg-gradient-to-r ${feature.color} text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]`}>
                      Explore Feature
                    </button>
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