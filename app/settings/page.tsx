'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebarStore";
import SlateEditor from "@/components/editor/SlateEditor";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
          {t("sidebar.settings")}
      </h1>
      
      <Button onClick={toggleSidebar} className="mt-4">
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </Button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Slate Editor</h2>
        <div className="mt-4 bg-white p-2">
          <SlateEditor />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
