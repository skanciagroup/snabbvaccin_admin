"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  BarChart2,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [showText, setShowText] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowText(true);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: isOpen ? "16rem" : "4rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("h-screen bg-primaryDark/10 p-4 relative")}
    >
      <Button
        variant="ghost"
        size="icon"
        className="w-full mb-4 text-primaryDark"
        onClick={toggleSidebar}
      >
        {isMounted && (isOpen ? <ChevronLeft /> : <ChevronRight />)}
      </Button>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <motion.a
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="h-5 w-5 text-primaryDark" />
            {showText && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="text-primaryDark transition-opacity duration-200"
              >
                {item.label}
              </motion.span>
            )}
          </motion.a>
        ))}
      </nav>
    </motion.div>
  );
}
