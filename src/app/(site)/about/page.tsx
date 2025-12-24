"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  Target, 
  Lightbulb, 
  Globe, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  Heart,
  Zap
} from "lucide-react";
import LampContainer from "@/components/LampLazy";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { motion } from "framer-motion";
import Link from "next/link";
import DeferredComponent from "@/components/DeferredComponent";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function AboutPage() {

  const values = [
    {
      icon: Heart,
      title: "Client-Centric",
      description: "We put our clients at the center of everything we do, ensuring their success is our success."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative solutions to stay ahead of the curve."
    },
    {
      icon: CheckCircle,
      title: "Quality",
      description: "We maintain the highest standards of quality in every project we undertake."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and transparent communication."
    }
  ];

  const stats = [
    { number: "50+", label: "Projects" },
    { number: "100%", label: "Satisfied Clients" },
    { number: "7", label: "Team Members" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Lamp */}
      <section className="h-screen">
        <DeferredComponent fallback={<SkeletonLoader className="w-full h-full" />}>
          <LampContainer className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center max-w-4xl mx-auto h-full flex items-center justify-center"
            >
              <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="py-4 text-center text-3xl font-thin tracking-widest text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Poppins", "Inter", "Quicksand", "Nunito", "Rubik", sans-serif' }}
              >
                Leading Innovator Software Company in Afghanistan
              </motion.h1>
            </motion.div>
          </LampContainer>
        </DeferredComponent>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-bold text-aboutHero-primary mb-4">
                    {stat.number}
                  </div>
                  <p className="text-lg text-gray-300 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-adminDash-secondary mr-3" />
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-300 mb-6">
                To empower businesses with innovative software solutions that drive growth, enhance efficiency, and create meaningful digital experiences. We strive to bridge the gap between complex technology requirements and practical business needs.
              </p>

              <div className="flex items-center mb-4">
                <Lightbulb className="h-8 w-8 text-adminDash-secondary mr-3" />
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-300">
                To be the global leader in software development, recognized for our innovation, quality, and customer-centric approach. We envision a future where technology seamlessly integrates with business to create extraordinary possibilities.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-aboutHero-primary/20 to-aboutHero-secondary/20 rounded-full flex items-center justify-center border border-gray-700 p-4">
                <div className="text-center">
                  <img 
                    src="/company-logo.png" 
                    alt="Turab Root Logo" 
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ccb1] via-[#7b61ff] to-[#ffc414] bg-clip-text text-transparent">Our Core Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide our work and shape our company culture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <BackgroundGradient 
                key={index} 
                className="h-full"
                containerClassName="h-full"
              >
                <div className="text-center bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                  <value.icon className={`h-16 w-16 mx-auto mb-6 ${
                    index === 0 ? "text-[#00ccb1]" : 
                    index === 1 ? "text-[#7b61ff]" : 
                    index === 2 ? "text-[#ffc414]" : 
                    "text-[#1ca0fb]"
                  }`} />
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed flex-1 flex items-center">
                    {value.description}
                  </p>
                </div>
              </BackgroundGradient>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-aboutHero-primary via-adminDash-secondary to-aboutHero-secondary"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100 via-aboutHero-secondary to-adminDash-secondary opacity-50"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center bg-white/5 backdrop-blur-2xl rounded-3xl p-16 border border-white/10 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-white to-[#D1F8EF] bg-clip-text text-transparent">
                Partner With Innovation
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-aboutHero-primary to-adminDash-secondary hover:from-[#1e5a8e] hover:to-[#2b5f9e] text-white rounded-full font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:rotate-1" asChild>
                  <Link href="/contact" prefetch={true} className="flex items-center justify-center">
                    Start Your Project
                  </Link>
                </Button>
                <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-aboutHero-primary to-adminDash-secondary hover:from-[#1e5a8e] hover:to-[#2b5f9e] text-white rounded-full font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:-rotate-1" asChild>
                  <Link href="/projects" prefetch={true} className="flex items-center justify-center">
                    View Our Work
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
