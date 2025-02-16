"use client";
import React from "react";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Bell,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Users" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

export function SidebarPopup() {
  return (
    <div className="absolute left-16 top-4 z-10 flex flex-col bg-white shadow-lg rounded-md p-2">
      {menuItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md"
        >
          <item.icon className="h-5 w-5 text-primaryDark" />
          <span className="text-primaryDark">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
