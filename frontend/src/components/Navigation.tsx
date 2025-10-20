"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, BarChart3, TrendingUp, FileText } from "lucide-react";
import { TextLogo } from "./Logo";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Home", icon: BarChart3 },
    { href: "/dashboard", label: "Dashboard", icon: TrendingUp },
    { href: "/analysis", label: "Analysis", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0D1117]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <TextLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold hover:bg-blue-700 transition">
            O
          </button>
        </div>
      </div>
    </header>
  );
}
