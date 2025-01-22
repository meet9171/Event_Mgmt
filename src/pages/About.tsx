import React from 'react';
import { Calendar, Users, Award, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const teamMembers = [
  {
    name: 'Yash Tiwari',
    role: 'Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Ashraf Chauhan',
    role: 'Founder, CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Meet Kathiriya',
    role: 'Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

const values = [
  {
    icon: Users,
    title: 'Customer First',
    description: 'We prioritize our customers\' needs in everything we do'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our service'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We are passionate about creating amazing event experiences'
  }
];

export const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#6B46C1] to-[#319795] text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl max-w-3xl mx-auto">
            Founded in 2025, EventFlow is revolutionizing the event management industry with its innovative solutions and advanced technology.
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Calendar className="w-16 h-16 text-[#6B46C1] mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600">
              To transform event management by offering smart, intuitive solutions that enable organizers to craft exceptional experiences.              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-12 h-12 text-[#6B46C1] mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};