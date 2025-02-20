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
  MapPin,
  Truck,
  BookOpenText,
  Hospital,
} from "lucide-react";
import { BiInjection } from "react-icons/bi";
import { AiOutlineAudit } from "react-icons/ai";
import { MdOutlineSchema, MdOutlineInventory } from "react-icons/md";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("sidebar.dashboard"),
      href: "/dashboard",
    },
    { icon: Users, label: t("sidebar.users"), href: "/users" },
    { icon: MapPin, label: t("sidebar.locations"), href: "/locations" },
    { icon: Truck, label: t("sidebar.busses"), href: "/busses" },
    { icon: BiInjection, label: t("sidebar.vaccines"), href: "/vaccines" },
    { icon: BookOpenText, label: t("sidebar.documents"), href: "/documents" },
    {
      icon: Hospital,
      label: t("sidebar.organisations"),
      href: "/organisations",
    },
    {
      icon: AiOutlineAudit,
      label: t("sidebar.inspections"),
      href: "/inspections",
    },
    { icon: MdOutlineSchema, label: t("sidebar.schemas"), href: "/schemas" },
    { icon: MdOutlineInventory, label: t("sidebar.stock"), href: "/stock" },
    { icon: BarChart2, label: t("sidebar.analytics"), href: "/analytics" },
    { icon: Bell, label: t("sidebar.notifications"), href: "/notifications" },
    { icon: Settings, label: t("sidebar.settings"), href: "/settings" },
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
      className={cn("h-screen bg-primary p-4 relative shadow-lg")}
    >
      <Button
        variant="ghost"
        size="icon"
        className="w-full mb-4 text-white rounded-xl hover:bg-primaryDark transition duration-200"
        onClick={toggleSidebar}
      >
        {isMounted && (isOpen ? <ChevronLeft /> : <ChevronRight />)}
      </Button>

      <nav className="space-y-2 ">
        {menuItems.map((item) => (
          <motion.a
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-xl cursor-pointer transition  duration-200 group",
              pathname === item.href
                ? "bg-primaryDark text-white"
                : "hover:bg-primaryDark text-white",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="h-5 w-5 group-hover:text-slate-50" />
            {showText && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="text-white transition-opacity text-sm duration-200"
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
