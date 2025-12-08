"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navigation />
      <main className="flex-1 -mt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}