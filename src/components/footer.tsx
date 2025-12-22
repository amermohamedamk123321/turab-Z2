import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, MessageCircle, Facebook } from "lucide-react";
import Image from "next/image";
import Meteors from "./MeteorsLazy";
import { memo } from "react";

const Footer = memo(function Footer() {
  return (
    <footer className="relative bg-gray-900 border-t border-gray-800 overflow-hidden">
      {/* Original beam positioned in center */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <Meteors number={40} className="absolute inset-0" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main footer content with three sections */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          
          {/* Left side - Company Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-2xl mb-4" style={{ color: '#F3F2EC' }}>Turab Root Company</h3>
            <p className="text-gray-300 mb-4 italic">
              Innovative leading software company of Afghanistan
            </p>
            <div className="space-y-2">
              <p className="text-gray-400">
                <span className="font-semibold" style={{ color: '#F3F2EC' }}>Industry:</span> Software Technology
              </p>
              <p className="text-gray-400">
                <span className="font-semibold" style={{ color: '#F3F2EC' }}>Mission:</span> Advancing and connecting the world to technology
              </p>
            </div>
          </div>

          {/* Middle - Logo */}
          <div className="flex-1 flex justify-center">
            <div className="w-40 h-40">
              <Image 
                src="/company-logo.png" 
                alt="Turab Root Logo" 
                width={160}
                height={160}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>

          {/* Right side - Contact & Social Media */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-2xl mb-4" style={{ color: '#F3F2EC' }}>Contact Us</h3>
            <div className="space-y-4">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/93792502101" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer"
              >
                <div className="bg-green-500/20 p-2 rounded-full group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <p className="text-white group-hover:text-green-400 transition-colors font-medium">
                    +93792502101
                  </p>
                </div>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=100095316722716" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer"
              >
                <div className="bg-blue-600/20 p-2 rounded-full group-hover:bg-blue-600/30 transition-colors">
                  <Facebook className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400">Facebook</p>
                  <p className="text-white group-hover:text-blue-400 transition-colors font-medium">
                    Turab Academy
                  </p>
                </div>
              </a>

              {/* Gmail */}
              <a 
                href="mailto:turabacademy96@gmail.com" 
                className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer"
              >
                <div className="bg-red-500/20 p-2 rounded-full group-hover:bg-red-500/30 transition-colors">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white group-hover:text-red-400 transition-colors font-medium">
                    turabacademy96@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Turab Root. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" prefetch={false} className="text-gray-400 hover:text-[#C1E93A] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false} className="text-gray-400 hover:text-[#C1E93A] transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
