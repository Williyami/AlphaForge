"use client";

import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/Navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AlphaForge - AI-Powered Equity Research</title>
        <meta name="description" content="Automated financial modeling and equity research platform" />
      </head>
      <body className="min-h-screen transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {mounted ? (
            <>
              <Navigation />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </>
          ) : (
            <div className="min-h-screen bg-[#0D1117]" />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
