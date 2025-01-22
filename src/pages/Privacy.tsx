import React from 'react';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#6B46C1] to-[#319795] text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg">
              <h2 className="text-3xl font-bold mb-8">Information We Collect</h2>
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-[#6B46C1] mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                    <p className="text-gray-600">
                      We collect information that you provide directly to us, including name, email address, and contact details when you register for our services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-[#6B46C1] mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
                    <p className="text-gray-600">
                      We automatically collect certain information about your device and how you interact with our services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FileCheck className="w-6 h-6 text-[#6B46C1] mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Event Information</h3>
                    <p className="text-gray-600">
                      Information about events you create or manage through our platform.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-4 text-gray-600 mb-12">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our services</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2 className="text-3xl font-bold mb-8">Data Security</h2>
              <p className="text-gray-600 mb-12">
                We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
              </p>

              <h2 className="text-3xl font-bold mb-8">Your Rights</h2>
              <p className="text-gray-600 mb-12">
                You have the right to access, update, or delete your personal information. Contact us if you wish to exercise any of these rights.
              </p>

              <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@eventflowpro.com" className="text-[#6B46C1] hover:underline">
                  mailto:privacy@eventflowpro.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};