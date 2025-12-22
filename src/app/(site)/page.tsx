"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Smartphone, Monitor, Headphones, Shield, MessageCircle, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import LaserFlowLazy from "@/components/LaserFlowLazy";
import MeteorsLazy from "@/components/MeteorsLazy";

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
    <div className="flex flex-col bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        {/* LaserFlow background */}
        <div className="absolute inset-0 z-0">
          <LaserFlowLazy
            style={{
              position: 'absolute',
              top: 0,
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
            wispIntensity={0}  // As specified
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
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4" style={{ marginLeft: '-24px', marginTop: '-40px' }}>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-thin mb-6 text-white tracking-widest" style={{ fontFamily: '"Poppins", "Inter", "Quicksand", "Nunito", "Rubik", sans-serif' }}>
              Turab Root
            </h1>
          </div>
        </div>
      </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#fbb70ef' }}>Our Services</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#fec9eff' }}>
              Comprehensive software solutions tailored to your business needs
            </p>
          </div>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 bg-gray-900/80 backdrop-blur-sm hover:border-[#fbb70ef]/60 relative overflow-hidden" style={{ borderColor: 'rgba(251, 183, 14, 0.3)' }}>
                {/* Light shining border effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, transparent, rgba(251, 183, 14, 0.1), transparent)' }}></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to bottom, transparent, rgba(251, 183, 14, 0.05), transparent)' }}></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 shadow-lg" 
                       style={{ backgroundColor: service.color, borderColor: 'rgba(251, 183, 14, 0.5)', boxShadow: '0 10px 15px -3px rgba(251, 183, 14, 0.2)' }}>
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-orange transition-colors duration-300" style={{ color: '#fbb70ef' }}>{service.title}</CardTitle>
                  <CardDescription className="text-lg" style={{ color: '#fec9eff' }}>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {service.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-sm bg-gray-800/80 border px-3 py-1" style={{ color: '#fec9eff', borderColor: 'rgba(251, 183, 14, 0.3)' }}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Final card */}
            <Card className="border-2 bg-gray-900/80 backdrop-blur-sm hover:border-[#fbb70ef]/80 relative overflow-hidden" style={{ borderColor: 'rgba(251, 183, 14, 0.5)' }}>
              {/* Light shining border effect */}
              <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(to right, transparent, rgba(251, 183, 14, 0.2), transparent)' }}></div>
              <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(to bottom, transparent, rgba(251, 183, 14, 0.1), transparent)' }}></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-2 border-white shadow-lg" style={{ backgroundColor: 'rgba(251, 183, 14, 0.1)', boxShadow: '0 10px 15px -3px rgba(251, 183, 14, 0.4)' }}>
                  <img src="/company-logo.png" alt="Company Logo" className="w-20 h-20 object-contain" />
                </div>
                <CardTitle className="text-3xl mb-4" style={{ color: '#fbb70ef' }}>All possible with Turab Root Family</CardTitle>
                <CardDescription className="text-lg max-w-2xl mx-auto" style={{ color: '#fec9eff' }}>
                  Together we achieve excellence through innovation, dedication, and cutting-edge technology solutions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Impact Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#fbb70ef' }}>Business Impact</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#fec9eff' }}>
              Our solutions deliver exceptional results that transform your business operations
            </p>
          </div>
          
          <Card className="max-w-6xl mx-auto border-2 backdrop-blur-sm hover:border-[#fbb70ef]/60 relative overflow-hidden" style={{ borderColor: 'rgba(251, 183, 14, 0.3)', backgroundColor: 'rgba(251, 183, 14, 0.05)' }}>
            {/* Glass-like shiny surface effects */}
            <div className="absolute inset-0 opacity-50 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(254, 201, 239, 0.05), transparent, rgba(237, 148, 85, 0.1))' }}></div>
            <div className="absolute inset-0 opacity-30 rounded-lg" style={{ background: 'linear-gradient(45deg, transparent, rgba(251, 183, 14, 0.03), transparent)' }}></div>
            <div className="absolute inset-0 opacity-20 rounded-lg" style={{ background: 'linear-gradient(to bottom, transparent, rgba(254, 201, 239, 0.02), transparent)' }}></div>
            
            <CardContent className="relative z-10 p-8">
              {/* First row - 3 circles (Credibility, Speed, Efficiency) */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                  {businessImpact.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-center group/impact">
                      <div className="w-28 h-28 mx-auto rounded-full backdrop-blur-sm border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-transform duration-300 shadow-lg" 
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(251, 183, 14, 0.1), rgba(237, 148, 85, 0.05))',
                             borderColor: 'rgba(251, 183, 14, 0.3)',
                             boxShadow: '0 10px 15px -3px rgba(251, 183, 14, 0.2)'
                           }}>
                        <div className="text-3xl font-bold text-white">{item.value}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#fec9eff' }}>{item.metric}</h3>
                      <p className="text-white/80 text-sm leading-relaxed max-w-xs">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Second row - 2 circles (Simplicity, Modern Design) */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                  {businessImpact.slice(3, 5).map((item, index) => (
                    <div key={index + 3} className="text-center group/impact">
                      <div className="w-28 h-28 mx-auto rounded-full backdrop-blur-sm border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-transform duration-300 shadow-lg" 
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(254, 201, 239, 0.1), rgba(251, 183, 14, 0.05))',
                             borderColor: 'rgba(254, 201, 239, 0.3)',
                             boxShadow: '0 10px 15px -3px rgba(254, 201, 239, 0.2)'
                           }}>
                        <div className="text-3xl font-bold text-white">{item.value}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#fbb70ef' }}>{item.metric}</h3>
                      <p className="text-white/80 text-sm leading-relaxed max-w-xs">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Third row - 1 circle (Yearly Update) - Completes the pyramid */}
              <div className="flex justify-center">
                <div className="text-center group/impact">
                  <div className="w-32 h-32 mx-auto rounded-full backdrop-blur-sm border-2 mb-4 flex items-center justify-center group-hover/impact:scale-110 transition-transform duration-300 shadow-xl" 
                       style={{ 
                         background: 'linear-gradient(135deg, rgba(237, 148, 85, 0.15), rgba(251, 183, 14, 0.08))',
                         borderColor: 'rgba(237, 148, 85, 0.4)',
                         boxShadow: '0 25px 50px -12px rgba(237, 148, 85, 0.3)'
                       }}>
                    <div className="text-4xl font-bold text-white">{businessImpact[5].value}</div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: '#fec9eff' }}>{businessImpact[5].metric}</h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-xs">{businessImpact[5].description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffbdaff 0%, #fec9eff 25%, #fbb70ef 75%, #ed9455 100%)' }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">Ready to start your project?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Let's bring your ideas to life with our innovative software solutions
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 bg-white hover:text-white rounded-full font-semibold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 ease-out border-2 border-transparent hover:border-white relative overflow-hidden group" 
            style={{ color: '#ed9455' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ed9455';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#ed9455';
            }}
            asChild
          >
            <Link href="/contact" prefetch={true}>
              {/* Default text */}
              <span className="relative z-10 group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-300 ease-out">Get in Touch with Us</span>
              {/* Hover text - appears in middle */}
              <span className="absolute inset-0 flex items-center justify-center relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-out">Get a Quote</span>
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" style={{ background: 'linear-gradient(to right, #ed9455, #fbb70ef)' }}></div>
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
              {/* Shine effect */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent group-hover:w-full transition-all duration-700 ease-out skew-x-12"></div>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
