import "./globals.css";
import { Inter } from "next/font/google";
import StoreProvider from "@/core/store/StoreProvider";
import QueryProvider from "@/core/providers/QueryProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "VietSignSchool",
  description: "Ứng dụng học ngôn ngữ ký hiệu Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased selection:bg-primary-100 selection:text-primary-900`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
