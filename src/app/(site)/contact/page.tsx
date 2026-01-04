"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  MessageCircle,
  Building,
  Users,
  Sparkles,
  ArrowUpRight,
  Star,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import OrbLazy from "@/components/OrbLazy";
import DeferredComponent from "@/components/DeferredComponent";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    projectType: "",
    designOption: "",
    securityOption: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      projectType: "",
      designOption: "",
      securityOption: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["turabacademy96@gmail.com"],
      gradient: "from-contactCard-card1Start to-contactCard-card1End"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+93 767 101 001", "+93 792 502 101"],
      gradient: "from-contactCard-card2Start to-contactCard-card2End"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Kabul , Afghanistan", "Dasht-e-Barchi , Hussainzada Market,\nfourth floor, office number 208"],
      gradient: "from-contactCard-card3Start to-contactCard-card3End"
    }
  ];

  const services = [
    "Web Development",
    "Mobile App Development",
    "Desktop Software",
    "UI/UX Design",
    "Consulting",
    "Support & Maintenance"
  ];

  const faqData = [
    {
      question: "Who are these services for and what are the benefits ?",
      answer: "Turab Root serves shops, clinics, restaurants and multi-branch companies with powerful and advanced systems to bring control, clarity and management .",
      icon: Clock
    },
    {
      question: "What is your pricing structure?",
      answer: "Cost depends on users, complexity , data migrations and chosen SLA . The more advanced the system is the more they get premium tags. ",
      icon: Star
    },
    {
      question: "Do you provide ongoing support and updates ?",
      answer: "Yes, we offer comprehensive support and maintenance packages to ensure your software continues to perform optimally after launch.",
      icon: Zap
    },
    {
      question: "Are your systems  Offline and/or  Online ?",
      answer: "The systems are either offline or online. They are based on you needs and requirements . We also make websites for your businesses too. ",
      icon: Sparkles
    }
  ];

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          
          <div className="container mx-auto px-4 z-10 relative h-full">
            <div className="text-center max-w-4xl mx-auto h-full flex flex-col justify-center">
              {/* Orb Component */}
              <div className="w-full h-[600px] relative mb-8">
                <DeferredComponent fallback={<SkeletonLoader className="w-full h-full rounded-full" />}>
                  <OrbLazy
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={280}
                    forceHoverState={false}
                  />
                </DeferredComponent>
              </div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-thin mb-6 text-white leading-tight tracking-normal"
                style={{ fontFamily: '"Poppins", "Inter", "Quicksand", "Nunito", "Rubik", sans-serif', marginTop: '-15px' }}
              >
                Tell us about Your Project
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 25% 25%, #FEC5F6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C562AF 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <BackgroundGradient className="rounded-[20px] p-1">
                <Card className="border-0 bg-gray-900/70 backdrop-blur-sm rounded-[20px] overflow-hidden">
                  <CardHeader className="pb-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center"
                    >
                      <div className="relative">
                        <MessageCircle className="h-7 w-7 text-contactCard-card3End/80" />
                        <motion.div 
                          className="absolute -top-1 -right-1 w-2 h-2 bg-[#FEC5F6]/60 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <CardTitle className="text-xl ml-3 text-white/90">Send us a message</CardTitle>
                    </motion.div>
                    <CardDescription className="text-gray-400/80 mt-1 text-sm">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle className="h-20 w-20 text-[#FEC5F6] mx-auto mb-6" />
                        </motion.div>
                        <h3 className="text-2xl font-semibold mb-3 text-white">Message Sent Successfully!</h3>
                        <p className="text-gray-400 mb-6">
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={() => setIsSubmitted(false)} 
                            className="bg-gradient-to-r from-[#B33791] to-[#C562AF] hover:from-[#C562AF] hover:to-[#DB8DD0] text-white px-6 py-3"
                          >
                            Send Another Message
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div 
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Label htmlFor="name" className="text-white mb-2 block">Name *</Label>
                            <div className="relative">
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                onFocus={() => handleFocus("name")}
                                onBlur={handleBlur}
                                placeholder="John Doe"
                                className="bg-gray-800/50 border-gray-700/50 text-white/80 placeholder-gray-600 focus:border-[#FEC5F6]/50 transition-all duration-300 peer"
                              />
                              <motion.div 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                                initial={{ width: 0 }}
                                animate={{ width: focusedField === "name" ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Label htmlFor="email" className="text-white mb-2 block">Email *</Label>
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => handleFocus("email")}
                                onBlur={handleBlur}
                                placeholder="john@example.com"
                                className="bg-gray-800/50 border-gray-700/50 text-white/80 placeholder-gray-600 focus:border-[#FEC5F6]/50 transition-all duration-300 peer"
                              />
                              <motion.div 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                                initial={{ width: 0 }}
                                animate={{ width: focusedField === "email" ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </motion.div>
                        </div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="phone" className="text-white mb-2 block">Phone (with Country Code)*</Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={handleChange}
                              onFocus={() => handleFocus("phone")}
                              onBlur={handleBlur}
                              placeholder="+1 (555) 123-4567"
                              pattern="^\+[1-9]\d{1,14}$"
                              title="Please include country code (e.g., +1 for US, +44 for UK, +91 for India)"
                              className="bg-gray-800/50 border-gray-700/50 text-white/80 placeholder-gray-600 focus:border-[#FEC5F6]/50 transition-all duration-300 peer"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "phone" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label htmlFor="subject" className="text-white mb-2 block">Subject *</Label>
                          <div className="relative">
                            <Input
                              id="subject"
                              name="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={handleChange}
                              onFocus={() => handleFocus("subject")}
                              onBlur={handleBlur}
                              placeholder="Project Inquiry"
                              className="bg-gray-800/50 border-gray-700/50 text-white/80 placeholder-gray-600 focus:border-[#FEC5F6]/50 transition-all duration-300 peer"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "subject" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        {/* Project Type Selection */}
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                        >
                          <Label htmlFor="projectType" className="text-white mb-2 block">Project Type *</Label>
                          <div className="relative">
                            <Select 
                              name="projectType" 
                              value={formData.projectType} 
                              onValueChange={(value) => {
                                setFormData({...formData, projectType: value});
                                handleFocus("projectType");
                              }}
                              onOpenChange={(open) => {
                                if (open) handleFocus("projectType");
                                else handleBlur();
                              }}
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white/80 focus:border-[#FEC5F6]/50 transition-all duration-300">
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700/50 text-white">
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="online-app">Online App</SelectItem>
                              </SelectContent>
                            </Select>
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "projectType" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        {/* Design Options */}
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label htmlFor="designOption" className="text-white mb-2 block">Design Option *</Label>
                          <div className="relative">
                            <Select 
                              name="designOption" 
                              value={formData.designOption} 
                              onValueChange={(value) => {
                                setFormData({...formData, designOption: value});
                                handleFocus("designOption");
                              }}
                              onOpenChange={(open) => {
                                if (open) handleFocus("designOption");
                                else handleBlur();
                              }}
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white/80 focus:border-[#FEC5F6]/50 transition-all duration-300">
                                <SelectValue placeholder="Select design option" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700/50 text-white">
                                <SelectItem value="simple">Simple</SelectItem>
                                <SelectItem value="beautifully-designed">Beautifully Designed</SelectItem>
                                <SelectItem value="complex-animation">Complex Animation Design</SelectItem>
                              </SelectContent>
                            </Select>
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "designOption" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        {/* Security Options */}
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 }}
                        >
                          <Label htmlFor="securityOption" className="text-white mb-2 block">Security Option *</Label>
                          <div className="relative">
                            <Select 
                              name="securityOption" 
                              value={formData.securityOption} 
                              onValueChange={(value) => {
                                setFormData({...formData, securityOption: value});
                                handleFocus("securityOption");
                              }}
                              onOpenChange={(open) => {
                                if (open) handleFocus("securityOption");
                                else handleBlur();
                              }}
                            >
                              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white/80 focus:border-[#FEC5F6]/50 transition-all duration-300">
                                <SelectValue placeholder="Select security option" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700/50 text-white">
                                <SelectItem value="low-secured">Low Secured</SelectItem>
                                <SelectItem value="well-secured">Well Secured</SelectItem>
                                <SelectItem value="highly-secured">Highly Secured</SelectItem>
                              </SelectContent>
                            </Select>
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "securityOption" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        {/* Investment Note */}
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="bg-gradient-to-r from-[#B33791]/20 to-[#FEC5F6]/20 border border-[#FEC5F6]/30 rounded-lg p-4">
                            <p className="text-sm text-[#FEC5F6]/90 text-center">
                              <span className="font-semibold">Note:</span> Higher security and design comes with higher investments.
                            </p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65 }}
                        >
                          <Label htmlFor="message" className="text-white mb-2 block">Message *</Label>
                          <div className="relative">
                            <Textarea
                              id="message"
                              name="message"
                              required
                              rows={5}
                              value={formData.message}
                              onChange={handleChange}
                              onFocus={() => handleFocus("message")}
                              onBlur={handleBlur}
                              placeholder="Tell us about your project..."
                              className="bg-gray-800/50 border-gray-700/50 text-white/80 placeholder-gray-600 focus:border-[#FEC5F6]/50 transition-all duration-300 peer resize-none"
                            />
                            <motion.div 
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#B33791] to-[#FEC5F6]"
                              initial={{ width: 0 }}
                              animate={{ width: focusedField === "message" ? "100%" : "0%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            type="submit" 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-[#B33791]/70 to-[#C562AF]/70 hover:from-[#B33791]/90 hover:to-[#C562AF]/90 text-white/90 hover:text-white font-medium py-3 text-base shadow-md hover:shadow-lg transition-all duration-300 border border-white/10"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="flex items-center justify-center"
                              >
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span className="ml-2">Sending...</span>
                              </motion.div>
                            ) : (
                              <motion.div className="flex items-center justify-center">
                                Send Message
                                <Send className="ml-2 h-5 w-5" />
                              </motion.div>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </BackgroundGradient>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-8 flex items-center text-white">
                  <Building className="h-8 w-8 mr-4 text-contactCard-card3End" />
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <BackgroundGradient className="rounded-[16px] p-1">
                        <Card className="border-0 bg-gray-900/60 backdrop-blur-sm rounded-[16px] overflow-hidden h-full">
                          <CardContent className="p-5">
                            <div className="flex items-start space-x-3">
                              <motion.div 
                                className="flex-shrink-0"
                                whileHover={{ scale: 1.05, rotate: 3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${info.gradient} flex items-center justify-center`}>
                                  <info.icon className="h-5 w-5 text-white/90" />
                                </div>
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-2 text-white/90 text-base">{info.title}</h3>
                                <div className="space-y-1">
                                  {info.details.map((detail, detailIndex) => (
                                    <motion.p 
                                      key={detailIndex} 
                                      className="text-sm text-gray-300/80 group-hover:text-white/90 transition-colors duration-300"
                                      whileHover={{ x: 3 }}
                                    >
                                      {detail}
                                    </motion.p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </BackgroundGradient>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-8 flex items-center text-white">
                  <Clock className="h-8 w-8 mr-4 text-[#FEC5F6]" />
                  Business Hours
                </h2>
                
                <BackgroundGradient className="rounded-[16px] p-1">
                  <Card className="border-0 bg-gray-900/60 backdrop-blur-sm rounded-[16px] overflow-hidden">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {[
                          { days: "Saturday - Friday", hours: "9:00 AM - 6:00 PM", color: "text-[#FEC5F6]/80" },
                          { days: "Friday", hours: "Closed", color: "text-gray-400/60" }
                        ].map((item, index) => (
                          <motion.div 
                            key={index}
                            className="flex justify-between items-center py-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ x: 3 }}
                          >
                            <span className="font-medium text-white/90">{item.days}</span>
                            <span className={`${item.color} font-medium text-sm`}>{item.hours}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-8 flex items-center text-white">
                  <Users className="h-8 w-8 mr-4 text-[#FEC5F6]" />
                  Our Services
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-[#FEC5F6]/10 text-[#B33791]/80 border-[#C562AF]/20 px-3 py-1.5 cursor-pointer hover:bg-[#FEC5F6]/20 transition-all duration-300"
                      >
                        {service}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#FEC5F6]"
              style={{
                width: Math.random() * 60 + 10,
                height: Math.random() * 60 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 40 - 20],
                x: [0, Math.random() * 40 - 20],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B33791] to-[#FEC5F6] bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Quick answers to common questions about our services and process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <BackgroundGradient className="rounded-[16px] p-1 h-full">
                  <Card className="border-0 bg-gray-900/60 backdrop-blur-sm rounded-[16px] overflow-hidden h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B33791] to-[#C562AF] flex items-center justify-center">
                            <faq.icon className="h-4 w-4 text-white/90" />
                          </div>
                        </div>
                        <CardTitle className="text-base text-white/90 leading-tight">{faq.question}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400/80 leading-relaxed text-sm">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
