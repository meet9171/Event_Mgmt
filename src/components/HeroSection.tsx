import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {

  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-teal-50 to-purple-50">
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
            repeatType: "reverse",
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
            repeatType: "reverse",
          }}
        />
      </motion.div>
      <div className="container mx-auto px-10 z-10 pt-40 sm:pt-36 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Event, Our Flow.
            </h1>
            <h2 className="text-xl md:text-lg text-gray-600 leading-relaxed">
              EventFlow is a comprehensive event management solution that makes planning easy and quick for conferences, weddings, and corporate events. It includes features like scheduling, collaboration, attendee tracking, and custom badge design. With EventFlow, enjoy a seamless and efficient event planning experience.
            </h2>
            <div className="flex flex-wrap gap-4">
             
                <button className="text-white bg-[#FF6B6B] hover:bg-[#FF5151] px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transform transition hover:scale-105" onClick={() => navigate("/login")}>
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              <a
                href="#features"
                className="border-2 border-grey  px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10 transform transition"
              >
                Explore Features <Play className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <img src="/hero.svg" alt="Event Management" />
          </div>
        </div>
      </div>
    </section>
  );
};
