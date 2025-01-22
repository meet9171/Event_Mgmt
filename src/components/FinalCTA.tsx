import React from "react";
import { Calendar, ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6B46C1] to-[#319795]" />

      <div className="relative container mx-auto px-4 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Events?
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-purple-100">
          Join hundreds of successful event organizers who rely on our trusted
          platform to bring their events to life{" "}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button className="bg-white text-[#6B46C1] px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transform transition hover:scale-105">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>

          <button className="flex items-center gap-2 text-white hover:text-purple-200 transition">
            <Calendar className="w-5 h-5" />
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  );
};
