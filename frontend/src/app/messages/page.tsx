import { Metadata } from "next";
import { DashboardLayout } from "@/shared/components/layout";
import { Messages } from "@/features/messages";

export const metadata: Metadata = {
  title: "Tin nhắn - VietSignSchool",
  description: "Trang tin nhắn của VietSignSchool",
};

export default function MessagesPage() {
  return (
    <DashboardLayout hideFooter>
      <Messages />
    </DashboardLayout>
  );
}
