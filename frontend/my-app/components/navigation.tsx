"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, BarChart3, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInDown, staggerContainer, navItem } from "@/lib/animations";

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
    <motion.nav 
      className="border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-md sticky top-0 z-50"
      initial="initial"
      animate="animate"
      variants={fadeInDown}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Trophy className="h-6 w-6 text-yellow-500" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Rift Rewind
              </span>
            </Link>
          </motion.div>

          {/* Nav Links */}
          <motion.div 
            className="flex items-center space-x-1"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.href}
                  variants={navItem}
                  custom={index}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all relative overflow-hidden",
                      isActive
                        ? "text-yellow-400"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {/* Background hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-slate-800/50 rounded-lg"
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.8
                      }}
                      whileHover={{ opacity: 0.5, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Icon with bounce on active */}
                    <motion.div
                      animate={isActive ? {
                        y: [0, -2, 0],
                        transition: {
                          duration: 0.6,
                          repeat: Infinity,
                          repeatDelay: 2
                        }
                      } : {}}
                      className="relative z-10"
                    >
                      <Icon className="h-4 w-4" />
                    </motion.div>
                    
                    <span className="font-medium relative z-10">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
                        layoutId="activeNav"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
