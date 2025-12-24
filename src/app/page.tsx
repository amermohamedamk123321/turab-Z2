"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Smartphone, Monitor, Headphones, Shield, MessageCircle, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import LaserFlowLazy from "@/components/LaserFlowLazy";
import MeteorsLazy from "@/components/MeteorsLazy";
import DeferredComponent from "@/components/DeferredComponent";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function Home() {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications and websites built with cutting-edge technologies",
      technologies: ["React", "Next.js", "Node.js", "JavaScript"],
      color: "#ed9455"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications for iOS and Android",
      technologies: ["React Native", "Flutter"],
      color: "#fbb70ef"
    },
    {
      icon: Monitor,
      title: "Desktop Software",
      description: "Powerful desktop applications for Windows",
      technologies: ["Electron", "Tauri"],
      color: "#fec9eff"
    },
    {
      icon: Headphones,
      title: "Support Services",
      description: "Comprehensive technical support and maintenance for all your software needs",
      technologies: ["24/7 Support", "Maintenance", "Consulting", "Training"],
      color: "#ed9455"
    },
    {
      icon: Shield,
      title: "Cyber Security Support",
      description: "Advanced security solutions to protect your digital assets and ensure data integrity",
      technologies: ["Security Audits", "Penetration Testing", "Compliance", "Risk Assessment"],
      color: "#fbb70ef"
    }
  ];

  const businessImpact = [
    { metric: "Credibility", value: "95%", description: "Enhanced brand trust and market presence" },
    { metric: "Speed", value: "3x", description: "Faster workflow and project delivery" },
    { metric: "Efficiency", value: "85%", description: "Reduced operational costs and time" },
    { metric: "Simplicity", value: "100%", description: "Intuitive user experience and adoption" },
    { metric: "Modern Design", value: "A+", description: "Cutting-edge UI/UX solutions" },
    { metric: "Yearly Update", value: "365", description: "Continuous improvement and innovation" }
  ];

  return (
    <div className="flex flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="relative">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        {/* LaserFlow background */}
        <div className="absolute inset-0 z-0" suppressHydrationWarning>
          <DeferredComponent fallback={<SkeletonLoader className="w-full h-full bg-black" />}>
            <LaserFlowLazy
              style={{
                position: 'absolute',
                top: -2,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 1,
                visibility: 'visible',
                background: 'black'
              }}
              color="#1E93AB"  // Changed to requested color
              horizontalSizing={2}  // As specified
              verticalSizing={3.2}  // As specified
              wispDensity={0.8}  // As specified
              wispSpeed={13}  // Back to original
              wispIntensity={1}  // As specified
              flowSpeed={0.39}  // Back to original
              flowStrength={1}  // As specified
              fogIntensity={0.45}  // As specified
              fogScale={0.39}  // As specified
              fogFallSpeed={0.6}  // Back to original
              decay={3}  // As specified
              falloffStart={1.22}  // As specified
              horizontalBeamOffset={0}  // Reset to zero
              verticalBeamOffset={0}  // Reset to zero
            />
          </DeferredComponent>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4" style={{ marginLeft: '-24px', marginTop: '-40px' }}>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-thin mb-6 tracking-widest hover:scale-105 transition-transform duration-700" style={{ 
              fontFamily: '"Poppins", "Inter", "Quicksand", "Nunito", "Rubik", sans-serif',
              color: '#ffffff !important'
            }}>
              Turab Root
            </h1>
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 transition-colors duration-300" style={{ color: '#ffffff' }}>
                <div className="w-2 h-2 bg-[#fbb70ef] rounded-full animate-pulse"></div>
                <span className="text-sm tracking-widest" style={{ color: '#ffffff' }}>EXCEPTIONAL SOFTWARE SOLUTIONS</span>
                <div className="w-2 h-2 bg-[#ed9455] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800/95 to-black relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#fbb70ef]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#ed9455]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#fec9eff]/15 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate-pulse" style={{ color: '#ffffff' }}>Our Services</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#ffffff' }}>
              Comprehensive software solutions tailored to your business needs
            </p>
          </div>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-2 bg-gray-800/60 backdrop-blur-md hover:border-[#fbb70ef]/80 relative overflow-hidden" 
                  style={{ 
                    borderColor: 'rgba(251, 183, 14, 0.3)',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 183, 14, 0.1)'
                  }}>
                {/* Enhanced light shining border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ 
                  background: 'linear-gradient(135deg, transparent 0%, rgba(251, 183, 14, 0.1) 30%, rgba(254, 201, 239, 0.08) 50%, rgba(237, 148, 85, 0.1) 70%, transparent 100%)' 
                }}></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700" style={{ 
                  background: 'linear-gradient(45deg, transparent, rgba(251, 183, 14, 0.05), transparent)' 
                }}></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-900" style={{ 
                  background: 'linear-gradient(to bottom, transparent, rgba(254, 201, 239, 0.03), transparent)' 
                }}></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 border-2 shadow-lg hover:shadow-2xl" 
                       style={{ 
                         background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`, 
                         borderColor: 'rgba(251, 183, 14, 0.6)', 
                         boxShadow: `0 10px 25px -5px ${service.color}66, 0 0 30px ${service.color}33, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                       }}>
                    <service.icon className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-yellow transition-all duration-300 text-white font-semibold" style={{ color: '#ffffff' }}>{service.title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed" style={{ color: '#ffffff' }}>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {service.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-sm bg-gray-800/60 border px-3 py-1 hover:scale-105 transition-all duration-300 hover:shadow-lg backdrop-blur-sm" style={{ 
                        color: 'white', 
                        borderColor: 'rgba(251, 183, 14, 0.4)',
                        background: 'rgba(251, 183, 14, 0.9)',
                        boxShadow: '0 2px 8px -2px rgba(251, 183, 14, 0.3)'
                      }}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Final card */}
            <Card className="border-2 bg-gray-800/60 backdrop-blur-md hover:border-[#fbb70ef]/90 relative overflow-hidden transition-all duration-500 hover:shadow-2xl" 
                  style={{ 
                    borderColor: 'rgba(251, 183, 14, 0.5)',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 183, 14, 0.2)'
                  }}>
              {/* Enhanced light shining border effect */}
              <div className="absolute inset-0 opacity-70 transition-all duration-500" style={{ 
                background: 'linear-gradient(135deg, transparent 0%, rgba(251, 183, 14, 0.2) 25%, rgba(254, 201, 239, 0.15) 50%, rgba(237, 148, 85, 0.2) 75%, transparent 100%)' 
              }}></div>
              <div className="absolute inset-0 opacity-50" style={{ 
                background: 'linear-gradient(45deg, transparent, rgba(251, 183, 14, 0.1), transparent)' 
              }}></div>
              <div className="absolute inset-0 opacity-30" style={{ 
                background: 'linear-gradient(to bottom, transparent, rgba(254, 201, 239, 0.08), transparent)' 
              }}></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-2 border-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-500" style={{ 
                  background: 'linear-gradient(135deg, rgba(251, 183, 14, 0.2), rgba(254, 201, 239, 0.15), rgba(237, 148, 85, 0.1))', 
                  boxShadow: '0 15px 35px -10px rgba(251, 183, 14, 0.4), 0 0 40px rgba(251, 183, 14, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                }}>
                  <img src="/company-logo.png" alt="Company Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
                </div>
                <CardTitle className="text-3xl mb-4 text-white font-bold animate-pulse" style={{ color: '#ffffff' }}>All possible with Turab Root Family</CardTitle>
                <CardDescription className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#ffffff' }}>
                  Together we achieve excellence through innovation, dedication, and cutting-edge technology solutions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Impact Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900/95 to-black relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#fbb70ef]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#ed9455]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-[#fec9eff]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate-pulse" style={{ color: '#ffffff' }}>Business Impact</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#ffffff' }}>
              Our solutions deliver exceptional results that transform your business operations
            </p>
          </div>
          
          <Card className="max-w-6xl mx-auto border-2 backdrop-blur-md hover:border-[#fbb70ef]/70 relative overflow-hidden transition-all duration-700 hover:shadow-2xl" style={{ 
            borderColor: 'rgba(251, 183, 14, 0.4)', 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 183, 14, 0.1)'
          }}>
            {/* Enhanced glass-like shiny surface effects */}
            <div className="absolute inset-0 opacity-60 rounded-lg transition-all duration-700" style={{ 
              background: 'linear-gradient(135deg, rgba(254, 201, 239, 0.1) 0%, transparent 30%, rgba(237, 148, 85, 0.12) 70%, transparent 100%)' 
            }}></div>
            <div className="absolute inset-0 opacity-40 rounded-lg transition-all duration-900" style={{ 
              background: 'linear-gradient(45deg, transparent, rgba(251, 183, 14, 0.08), transparent)' 
            }}></div>
            <div className="absolute inset-0 opacity-30 rounded-lg transition-all duration-1100" style={{ 
              background: 'linear-gradient(to bottom, transparent, rgba(254, 201, 239, 0.05), transparent)' 
            }}></div>
            <div className="absolute inset-0 opacity-20 rounded-lg transition-all duration-1300" style={{ 
              background: 'linear-gradient(225deg, transparent, rgba(255, 251, 218, 0.03), transparent)' 
            }}></div>
            
            <CardContent className="relative z-10 p-8">
              {/* First row - 3 circles (Credibility, Speed, Efficiency) */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                  {businessImpact.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-center group/impact">
                      <div className="w-28 h-28 mx-auto rounded-full backdrop-blur-md border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-all duration-500 shadow-lg hover:shadow-2xl" 
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(251, 183, 14, 0.2), rgba(237, 148, 85, 0.12))',
                             borderColor: 'rgba(251, 183, 14, 0.5)',
                             boxShadow: '0 10px 25px -5px rgba(251, 183, 14, 0.3), 0 0 30px rgba(251, 183, 14, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                           }}>
                        <div className="text-3xl font-bold text-white drop-shadow-lg">{item.value}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white transition-all duration-300 group-hover/impact:scale-105" style={{ color: '#ffffff' }}>{item.metric}</h3>
                      <p className="text-sm leading-relaxed max-w-xs transition-all duration-300 group-hover/impact:text-yellow" style={{ color: '#ffffff' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Second row - 2 circles (Simplicity, Modern Design) */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                  {businessImpact.slice(3, 5).map((item, index) => (
                    <div key={index + 3} className="text-center group/impact">
                      <div className="w-28 h-28 mx-auto rounded-full backdrop-blur-md border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-all duration-500 shadow-lg hover:shadow-2xl" 
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(254, 201, 239, 0.2), rgba(251, 183, 14, 0.12))',
                             borderColor: 'rgba(254, 201, 239, 0.5)',
                             boxShadow: '0 10px 25px -5px rgba(254, 201, 239, 0.3), 0 0 30px rgba(254, 201, 239, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                           }}>
                        <div className="text-3xl font-bold text-white drop-shadow-lg">{item.value}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white transition-all duration-300 group-hover/impact:scale-105" style={{ color: '#ffffff' }}>{item.metric}</h3>
                      <p className="text-sm leading-relaxed max-w-xs transition-all duration-300 group-hover/impact:text-yellow" style={{ color: '#ffffff' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Third row - 1 circle (Yearly Update) - Completes the pyramid */}
              <div className="flex justify-center">
                <div className="text-center group/impact">
                  <div className="w-32 h-32 mx-auto rounded-full backdrop-blur-md border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-all duration-500 shadow-xl hover:shadow-3xl" 
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(237, 148, 85, 0.25), rgba(251, 183, 14, 0.15))',
                         borderColor: 'rgba(237, 148, 85, 0.6)',
                         boxShadow: '0 25px 50px -12px rgba(237, 148, 85, 0.4), 0 0 40px rgba(237, 148, 85, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                       }}>
                    <div className="text-4xl font-bold text-white drop-shadow-lg">{businessImpact[5].value}</div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-white transition-all duration-300 group-hover/impact:scale-105" style={{ color: '#ffffff' }}>{businessImpact[5].metric}</h3>
                  <p className="text-sm leading-relaxed max-w-xs transition-all duration-300 group-hover/impact:text-yellow" style={{ color: '#ffffff' }}>{businessImpact[5].description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 25%, rgba(251, 183, 14, 0.1) 40%, rgba(237, 148, 85, 0.1) 50%, rgba(251, 183, 14, 0.1) 60%, rgba(254, 201, 239, 0.08) 75%, rgba(0, 0, 0, 0.8) 90%, rgba(0, 0, 0, 0.9) 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease-in-out infinite'
      }}>
        <style jsx>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes buttonGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <div className="absolute inset-0 bg-black/40"></div>
        {/* Enhanced animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-[rgba(251, 183, 14, 0.15)] to-[rgba(254, 201, 239, 0.1)] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-tl from-[rgba(237, 148, 85, 0.15)] to-[rgba(251, 183, 14, 0.1)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-[rgba(251, 183, 14, 0.12)] to-[rgba(254, 201, 239, 0.08)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="hidden md:block absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-[rgba(251, 183, 14, 0.1)] to-[rgba(237, 148, 85, 0.08)] rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
          <div className="hidden md:block absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-[rgba(237, 148, 85, 0.12)] to-[rgba(254, 201, 239, 0.08)] rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-bl from-[rgba(251, 183, 14, 0.1)] to-[rgba(237, 148, 85, 0.06)] rounded-full blur-2xl"></div>
          <div className="hidden lg:block absolute bottom-1/3 right-1/3 w-56 h-56 bg-gradient-to-t from-[rgba(254, 201, 239, 0.1)] to-[rgba(237, 148, 85, 0.08)] rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-8 drop-shadow-2xl animate-pulse" style={{ color: '#ffffff' }}>Ready to start your project?</h2>

          <Button
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-[#fbb70ef] rounded-full font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 ease-out border-2 border-[#ed9455] relative overflow-hidden group"
            style={{
              color: '#ffffff',
              boxShadow: '0 20px 40px -15px rgba(251, 183, 14, 0.4), 0 0 0 1px rgba(237, 148, 85, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 183, 14, 0.9), rgba(237, 148, 85, 0.9))';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#fbb70ef';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(251, 183, 14, 0.6), 0 0 30px rgba(251, 183, 14, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fbb70ef';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#ed9455';
              e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(251, 183, 14, 0.4), 0 0 0 1px rgba(237, 148, 85, 0.3)';
            }}
            asChild
          >
            <Link href="/contact" prefetch={true}>
              {/* Default text */}
              <span className="relative z-10 inline sm:hidden" style={{ color: '#ffffff' }}>Get in Touch</span>
              <span className="relative z-10 hidden sm:inline" style={{ color: '#ffffff' }}>Get in Touch with Us</span>
              {/* Hover text - appears in middle */}
              <span className="absolute inset-0 flex items-center justify-center relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-out" style={{ color: '#ffffff' }}>Get a Quote</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
