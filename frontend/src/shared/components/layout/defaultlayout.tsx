"use client";
import React from "react";
import { Header } from "../layout/header";
import { Footer } from "../layout/footer";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <div className="mt-[200px]">
        <Footer />
      </div>
    </div>
  );
}
