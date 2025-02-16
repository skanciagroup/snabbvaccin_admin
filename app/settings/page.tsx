'use client'
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebarStore";

export default function SettingsPage() {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings Page</h1>
      <p className="mt-4">
        This is a dummy settings page to test sidebar behavior.
      </p>
      <Button onClick={toggleSidebar} className="mt-4">
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </Button>
    </div>
  );
}
