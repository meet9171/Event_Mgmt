import React from 'react';
import { Calendar, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';


export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br ffrom-teal-50 to-purple-50">
      {/* Video Background */}
      {/* <div className="absolute inset-0 z-0">
        <video
          className="object-cover w-full h-full opacity-20"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d" type="video/mp4" />
        </video>
      </div> */}
 
      {/* Floating background elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-400/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Revolutionize Your Event Management
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-500 leading-relaxed">
              From planning to execution, we streamline every step
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#FF6B6B] hover:bg-[#FF5151] px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transform transition hover:scale-105">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <a href='#features' className="border-2 border-grey  px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10 transform transition">
                Explore Features <Play className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
<img src="/hero.svg" alt="Event Management" />


            {/* <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <Calendar className="w-12 h-12 text-[#6B46C1] mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Interactive Demo
                </h3>
                <p className="text-gray-600 mb-4">
                  Experience how easy it is to manage your next event
                </p>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <span className="text-[#6B46C1] font-semibold">{item}</span>
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#319795] rounded-full"
                          style={{ width: `${item * 25}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};