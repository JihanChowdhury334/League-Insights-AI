"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BarChart3, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Trophy,
  },
  {
    name: "Stats",
    href: "/stats",
    icon: BarChart3,
  },
  {
    name: "Timeline",
    href: "/timeline",
    icon: Clock,
  },
  {
    name: "Recap",
    href: "/recap",
    icon: Sparkles,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Rift Rewind
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-slate-800/50 text-yellow-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
