import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Home } from "@/features/home";

export const metadata: Metadata = {
  title: "Home - VietSignSchool",
  description: "Home page for VietSignSchool",
};

export default function HomePage() {
  return (
    <DashboardLayout>
      <Home />
    </DashboardLayout>
  );
}
