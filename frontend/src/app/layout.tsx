//"use client"
import "./globals.css";
import StoreProvider from "@/core/store/StoreProvider";
import QueryProvider from "@/core/providers/QueryProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import Script from "next/script";

export const metadata = {
  title: "VietSignSchool App",
  description: "App cnv",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <QueryProvider>
            <ThemeProvider>
              <div className="font-sans antialiased selection:bg-primary-100 selection:text-primary-900">
                {children}
              </div>
            </ThemeProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
