"use client";

import { LandingPage } from "@/features/landing";
import { SmartLayout } from "@/shared/components/layout";
import { Home } from "@/features/home";

export default function HomePage() {
  return (
    <SmartLayout
      // Content shown when user is logged in (uses DashboardLayout)
      authContent={<Home />}
      // Content shown when user is not logged in (uses DefaultLayout)
      guestContent={<LandingPage />}
    />
  );
}

