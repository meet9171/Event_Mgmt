import React from 'react';
import { Star, Play } from 'lucide-react';

const testimonials = [
  {
    name: 'Dhwani Mistry',
    role: 'Event Manager',
    company: 'Coderkube Events Co.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: "EventFlow has revolutionized the way we manage our events. The AI-powered features are truly game-changing, making planning and execution smoother than ever. It’s hard to imagine event management without EventFlow."
  },
  {
    name: 'Ashraf Chauhan',
    role: 'CEO',
    company: 'Nvidia Corporation',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: "Since implementing EventFlow, we've experienced a 40% boost in efficiency. The platform has streamlined our event management, reducing manual tasks and errors. With enhanced collaboration and automation, we’re able to focus more on delivering exceptional events."
  },
  {
    name: 'Femil Sabhaya',
    role: 'Event Manager',
    company: 'Safaya Events',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
    quote: "EventFlow's automation features have saved us countless hours of manual work. By streamlining repetitive tasks, we’ve been able to focus on more strategic aspects of event management. It’s a game-changer for efficiency.."
  }
];

const clientLogos = [
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/apple.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nike.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/puma.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/samsung.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/amazon.svg',
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nvidia.svg'
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
            Join hundreds of satisfied customers across the globe
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