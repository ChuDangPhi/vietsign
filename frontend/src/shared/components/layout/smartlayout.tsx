"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DefaultLayout from "./defaultlayout";
import DashboardLayout from "./authlayout";
import Loader from "@/shared/components/ui/Loader";

interface SmartLayoutProps {
  children?: React.ReactNode;
  // Content to show when authenticated (optional, defaults to children)
  authContent?: React.ReactNode;
  // Content to show when not authenticated (optional, defaults to children)
  guestContent?: React.ReactNode;
}

/**
 * SmartLayout - Automatically switches between DefaultLayout and DashboardLayout
 * based on user authentication status.
 * 
 * Usage:
 * - If user is logged in → Shows DashboardLayout with authContent (or children)
 * - If user is not logged in → Shows DefaultLayout with guestContent (or children)
 */
export default function SmartLayout({ 
  children, 
  authContent, 
  guestContent 
}: SmartLayoutProps) {
  const isAuthenticated = useSelector((state: any) => state.admin.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage directly for token
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    
    if (accessToken && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(isAuthenticated);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  // Update when Redux state changes
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
    }
  }, [isAuthenticated]);

  // Show loading while checking auth status
  if (isLoading) {
    return <Loader />;
  }

  // User is logged in - show DashboardLayout
  if (isLoggedIn) {
    return (
      <DashboardLayout>
        {authContent || children}
      </DashboardLayout>
    );
  }

  // User is not logged in - show DefaultLayout
  return (
    <DefaultLayout>
      {guestContent || children}
    </DefaultLayout>
  );
}
