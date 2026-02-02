"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group mr-2">
              <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
                <Image
                  src="/icon.svg"
                  alt="VietSignSchool Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  VietSign<span className="text-primary-600">School</span>
                </span>
                <p className="text-xs text-gray-500 -mt-1">Ngôn ngữ ký hiệu</p>
              </div>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <button className="text-sm font-medium text-gray-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Đăng nhập
              </button>
            </Link>
            <Link href="/register">
              <button className="text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Đăng ký
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
