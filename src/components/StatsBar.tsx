import React, { useEffect, useState } from 'react';
import { Users, Calendar, Star, Award } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Users', value: 150 },
  { icon: Calendar, label: 'Events Managed', value: 1250 },
  { icon: Star, label: 'Client Satisfaction', value: 98 },
  { icon: Award, label: 'Industry Awards', value: 10 }
];

export const StatsBar = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(current);
          return newCounts;
        });
      }, duration / steps);

      return () => clearInterval(timer);
    });
  }, []);

  return (
    <div className="bg-[#6B46C1] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center text-white">
                <Icon className="w-8 h-8 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {counts[index].toLocaleString()}
                  {stat.label === 'Client Satisfaction' ? '%' : '+'}
                </div>
                <div className="text-purple-200">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};