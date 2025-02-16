'use client'
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebarStore";
import SlateEditor from "@/components/editor/SlateEditor"
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
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Slate Editor</h2>
        <div className="mt-4 bg-white p-2" >
        <SlateEditor /> 
        </div>
      </div>
    </div>
  );
}
