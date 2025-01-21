import React from 'react';
import { Star, Play } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Director',
    company: 'Global Events Co.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: 'This platform has transformed how we manage our events. The AI features are game-changing.'
  },
  {
    name: 'Michael Chen',
    role: 'CEO',
    company: 'Tech Conferences Inc.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: "We've seen a 40% increase in efficiency since implementing this system."
  },
  {
    name: 'Emma Davis',
    role: 'Operations Manager',
    company: 'Summit Events',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: 'The automation features have saved us countless hours of manual work.'
  }
];

const clientLogos = [
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/apple.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoft.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/amazon.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/meta.svg'
];

export const SocialProof = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied customers worldwide
          </p>
        </div>

        {/* Client Logos */}
        <div className="flex flex-wrap justify-center gap-12 mb-16">
          {clientLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt="Client Logo"
              className="h-12 opacity-50 hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700">{testimonial.quote}</p>
            </div>
          ))}
        </div>

        {/* Video Testimonial */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Video Thumbnail"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center transform transition hover:scale-110">
              <Play className="w-8 h-8 text-[#6B46C1] ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};