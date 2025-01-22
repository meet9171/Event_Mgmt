// import React from 'react';
// import { Calendar, Twitter, Linkedin, Github, Mail } from 'lucide-react';

// export const Footer = () => {
//   return (
//     <footer className="bg-white border-t border-gray-200">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <Calendar className="w-6 h-6 text-[#6B46C1]" />
//               <span className="font-bold text-xl bg-gradient-to-r from-[#6B46C1] to-[#319795] bg-clip-text text-transparent">
//                 EventFlow Pro
//               </span>
//             </div>
//             <p className="text-gray-600 mb-4">
//               Revolutionizing event management with smart solutions.
//             </p>
//             <div className="flex gap-4">
//               <a href="#" className="text-gray-400 hover:text-[#6B46C1] transition">
//                 <Twitter className="w-5 h-5" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-[#6B46C1] transition">
//                 <Linkedin className="w-5 h-5" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-[#6B46C1] transition">
//                 <Github className="w-5 h-5" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-[#6B46C1] transition">
//                 <Mail className="w-5 h-5" />
//               </a>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Features</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Pricing</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Integrations</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Enterprise</a></li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Documentation</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">API Reference</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Blog</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Community</a></li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">About Us</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Careers</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Privacy Policy</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-[#6B46C1] transition">Terms of Service</a></li>
//             </ul>
//           </div>
//         </div>

//         <div className="pt-8 border-t border-gray-200">
//           <p className="text-center text-gray-600">
//             © {new Date().getFullYear()} EventFlow Pro. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

import React from 'react';
import { Calendar, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-[#6B46C1]" />
              <span className="font-bold text-xl bg-gradient-to-r from-[#6B46C1] to-[#319795] bg-clip-text text-transparent">
                EventFlow Pro
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Revolutionizing event management with smart solutions.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href="mailto:contact@eventflowpro.com" className="text-gray-600 hover:text-[#6B46C1] transition">
                mailto:contact@eventflowpro.com
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-600 hover:text-[#6B46C1] transition">About Us</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-[#6B46C1] transition">Privacy Policy</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-[#6B46C1] transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} EventFlow Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};