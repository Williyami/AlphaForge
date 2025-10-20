"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Home, BarChart3, TrendingUp, FileText, Briefcase, BookmarkCheck } from "lucide-react";
import { TextLogo } from "./Logo";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: TrendingUp },
    { href: "/analysis", label: "Analysis", icon: FileText },
    { href: "/lbo", label: "LBO", icon: Briefcase },
    { href: "/saved", label: "Saved", icon: BookmarkCheck },
  ];

  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md shadow-sm dark:shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <TextLogo />
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 !text-white shadow-lg shadow-blue-600/50"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              aria-label="Toggle theme"
              title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
            >
              <div className="relative w-5 h-5">
                {currentTheme === "dark" ? (
                  <Moon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-600 group-hover:text-yellow-500 transition-colors" />
                )}
              </div>
            </button>

            <button className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold hover:shadow-lg hover:shadow-blue-600/50 transition-all text-white">
              W
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 !text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
