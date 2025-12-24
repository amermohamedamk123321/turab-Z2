"use client";

import { useState, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const Navigation = memo(function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be replaced with actual auth state

  // Map of page-specific colors: normal and active (bright) states
  const pageColors = useMemo(() => ({
    '/': {
      name: 'Home',
      borderNormal: '#FFD700',    // Rich gold/yellow
      borderActive: '#FFED4E',    // Bright yellow
    },
    '/projects': {
      name: 'Projects',
      borderNormal: '#1DB954',    // Rich green
      borderActive: '#1ed760',    // Bright green
    },
    '/about': {
      name: 'About Us',
      borderNormal: '#0066FF',    // Rich blue
      borderActive: '#4D94FF',    // Bright blue
    },
    '/contact': {
      name: 'Contact Us',
      borderNormal: '#E74C3C',    // Rich red/pink
      borderActive: '#FF6B6B',    // Bright red/pink
    },
  }), []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-md bg-black/10">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex h-20 items-center justify-between"> {/* Decreased from h-24 to h-20 (about 17% reduction) */}
          {/* Logo with frosted glass box */}
          <div className="flex items-center space-x-4">
            <Link href="/" prefetch={true} className="flex items-center space-x-2">
              <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-2 flex items-center space-x-2 shadow-lg"> {/* Increased from p-1 to p-2 */}
                <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden">
                <Image 
                  src="/company-logo.png" 
                  alt="Turab Root Logo" 
                  width={48}
                  height={48}
                  className="object-contain"
                />
                </div>
                <span className="font-bold text-2xl text-white" style={{ color: '#ffffff !important' }}>
                  Turab Root
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const colors = pageColors[item.href] || pageColors['/'];
              const borderColor = isActive ? colors.borderActive : colors.borderNormal;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={`text-xs md:text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 rounded-2xl md:rounded-3xl px-3 md:px-5 lg:px-6 py-4 md:py-5 bg-white/90 text-black hover:bg-white shadow-md hover:shadow-lg ${
                    isActive ? "border-4" : "border-2"
                  }`}
                  style={{
                    borderColor: borderColor,
                  }}
                >
                  <Link href={item.href} prefetch={item.href !== '/admin/login'}>
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Button variant="ghost" size="sm" className="text-xs lg:text-sm text-black hover:text-black hover:bg-white/20 bg-white/90 border border-white/30 rounded-2xl md:rounded-full px-2 md:px-4 lg:px-6">
                  <User className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                  className="text-xs lg:text-sm border-gray-300 text-black hover:bg-white/90 bg-white/90 rounded-2xl md:rounded-full px-2 md:px-4 lg:px-6"
                >
                  <LogOut className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button asChild className="rounded-2xl md:rounded-3xl px-3 md:px-5 lg:px-6 py-4 md:py-5 border-2 border-transparent transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl overflow-hidden relative bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#EC4899] hover:from-[#06B6D4] hover:via-[#EC4899] hover:to-[#7C3AED]">
                <Link href="/admin/login" prefetch={false} className="relative z-10 flex items-center">
                  <User className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2 text-white" />
                  <span className="text-xs md:text-sm lg:text-base text-white font-semibold">Admin</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-black hover:text-black hover:bg-white font-medium transition-all duration-300 hover:scale-105 bg-white/90 border-2 border-white/80 rounded-2xl px-4 py-4 shadow-md hover:shadow-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] md:w-[400px] bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl p-4">
              <style jsx>{`
                [role="dialog"] button[aria-label="Close"] {
                  color: #000000 !important;
                  background-color: rgba(255, 255, 255, 0.9) !important;
                  border: 2px solid rgba(255, 255, 255, 0.3) !important;
                  border-radius: 0.5rem !important;
                  width: 40px !important;
                  height: 40px !important;
                  padding: 0 !important;
                  top: 1rem !important;
                  right: 1rem !important;
                }
                [role="dialog"] button[aria-label="Close"]:hover {
                  background-color: white !important;
                }
              `}</style>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-3 mt-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const colors = pageColors[item.href] || pageColors['/'];
                  const borderColor = isActive ? colors.borderActive : colors.borderNormal;

                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      asChild
                      className={`text-sm md:text-base font-medium transition-all duration-300 justify-start rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 bg-white/90 text-black hover:bg-white shadow-md hover:shadow-lg ${
                        isActive ? "border-4" : "border-2"
                      }`}
                      style={{
                        borderColor: borderColor,
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href} prefetch={item.href !== '/admin/login'}>
                        {item.name}
                      </Link>
                    </Button>
                  );
                })}
                <div className="pt-3 md:pt-4 border-t border-white/30">
                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" className="justify-start text-sm md:text-base text-black hover:text-black hover:bg-white/20 bg-white/90 border border-white/30 rounded-2xl md:rounded-full px-4 md:px-6 py-3 md:py-2">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-sm md:text-base border-gray-300 text-black hover:bg-white/90 bg-white/90 rounded-2xl md:rounded-full px-4 md:px-6 py-3 md:py-2"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 border-2 border-transparent transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden relative bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#EC4899] hover:from-[#06B6D4] hover:via-[#EC4899] hover:to-[#7C3AED]">
                      <Link href="/admin/login" prefetch={false} onClick={() => setIsOpen(false)} className="relative z-10 flex items-center">
                        <User className="h-4 w-4 mr-2 text-white" />
                        <span className="text-sm md:text-base text-white font-semibold">Admin</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
});

export default Navigation;
