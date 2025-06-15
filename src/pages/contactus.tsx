import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Building, MapPin, ChevronLeftIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1016] to-[#111827] flex flex-col p-4 sm:p-6 lg:p-8">
      
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">Contact Us</h1>
          <p className="text-sm text-gray-400 mb-6">Last updated on {new Date().toLocaleDateString()}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-300">We'd love to hear from you. Feel free to reach out using the information below:</p>
              
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors duration-200">
                  <Building className="text-green-400" />
                  <span className="font-semibold text-green-400">Company:</span>
                  <span className="text-gray-300">ChatPulse AI</span>
                </li>
                <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors duration-200">
                  <Phone className="text-green-400" />
                  <span className="font-semibold text-green-400">Phone:</span>
                  <span className="text-gray-300">+91 7418503548</span>
                </li>
                <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors duration-200">
                  <Mail className="text-green-400" />
                  <span className="font-semibold text-green-400">Email:</span>
                  <span className="text-gray-300">aiagency444@gmai.com</span>
                </li>
                
              </ul>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">Send us a Message</h2>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
                <input type="email" placeholder="Your Email" className="w-full p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
                <textarea placeholder="Your Message" rows={4} className="w-full p-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
                <Link href={'/'}>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200">Send Message</button>

                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;