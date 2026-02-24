"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { Header } from "./header-auth/index";
import { Footer } from "./footer/index";

interface LearnLayoutProps {
  children: React.ReactNode;
}

export const LearnLayout: React.FC<LearnLayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: any) => state.admin.isAuthenticated);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const toggleSidebar = () => { };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Content - with padding for fixed header */}
      <main className="flex-1 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
        <div className="mt-[200px]">
          <Footer />
        </div>
      </main>
    </div>
  );
};
