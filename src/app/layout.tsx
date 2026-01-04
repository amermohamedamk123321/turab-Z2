import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LayoutWrapper from "@/components/layout-wrapper";
import { ServiceWorkerInit } from "@/components/ServiceWorkerInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turab Root - Web, Mobile & Desktop Software Development",
  description: "Leading software company specializing in web applications, mobile apps, desktop software, and comprehensive support services. Transform your ideas into reality.",
  keywords: ["Turab Root", "software company", "web development", "mobile apps", "desktop software", "software services", "tech solutions"],
  authors: [{ name: "Turab Root Team" }],
  openGraph: {
    title: "Turab Root - Professional Software Development",
    description: "Expert web, mobile, and desktop software development services",
    url: "https://turabroot.com",
    siteName: "Turab Root",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turab Root - Professional Software Development",
    description: "Expert web, mobile, and desktop software development services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col relative`}
        suppressHydrationWarning
      >
        <ServiceWorkerInit />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
