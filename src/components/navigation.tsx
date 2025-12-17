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
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const colors = pageColors[item.href] || pageColors['/'];
              const borderColor = isActive ? colors.borderActive : colors.borderNormal;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={`text-sm font-medium transition-all duration-300 hover:scale-105 rounded-full px-4 py-2 bg-white/90 text-black hover:bg-white ${
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
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-black hover:text-black hover:bg-white/20 bg-white/90 border border-white/30 rounded-full">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsLoggedIn(false)}
                  className="border-gray-300 text-white hover:bg-white/90 bg-white/90 rounded-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="relative group">
                <Button asChild className="rounded-full px-12 py-5 border-2 border-transparent hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden relative bg-gradient-to-r from-[#146C94] via-[#19A7CE] to-[#146C94] hover:from-[#0f4a61] hover:via-[#146C94] hover:to-[#0f4a61]">
                  <Link href="/admin/login" prefetch={false} className="relative z-10 flex items-center">
                    <User className="h-4 w-4 mr-2 text-white" />
                    <span className="text-white font-medium">Admin</span>
                  </Link>
                </Button>
                {/* Glass shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent group-hover:w-full transition-all duration-700 ease-out skew-x-12"></div>
                </div>
                {/* Additional shine layer for more realistic glass effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-black hover:text-black hover:bg-white/20 bg-white/90 border border-white/30 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-lg border border-white/20">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const colors = pageColors[item.href] || pageColors['/'];
                  const borderColor = isActive ? colors.borderActive : colors.borderNormal;

                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      asChild
                      className={`text-sm font-medium transition-all duration-300 justify-start rounded-full px-4 py-2 bg-white/90 text-black hover:bg-white ${
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
                <div className="pt-4 border-t border-white/20">
                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" className="justify-start text-black hover:text-black hover:bg-white/20 bg-white/90 border border-white/30 rounded-full">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start border-gray-300 text-black hover:bg-white/90 bg-white/90 rounded-full"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <Button asChild className="w-full rounded-full px-12 py-5 border-2 border-transparent hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden relative bg-gradient-to-r from-[#146C94] via-[#19A7CE] to-[#146C94] hover:from-[#0f4a61] hover:via-[#146C94] hover:to-[#0f4a61]">
                        <Link href="/admin/login" prefetch={false} onClick={() => setIsOpen(false)} className="relative z-10 flex items-center">
                          <User className="h-4 w-4 mr-2 text-white" />
                          <span className="text-white font-medium">Admin</span>
                        </Link>
                      </Button>
                      {/* Glass shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent group-hover:w-full transition-all duration-700 ease-out skew-x-12"></div>
                      </div>
                      {/* Additional shine layer for more realistic glass effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                      </div>
                    </div>
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
