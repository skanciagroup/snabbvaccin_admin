"use client";
import { useTranslation } from "react-i18next";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OverviewChart } from "@/components/dashboard/overview-chart";

export default function DashboardPage() {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          {t("dashboard.title")}
        </h2>
      </div>
      <StatsCards />
      <div className="grid gap-6 md:grid-cols-2">
        <OverviewChart />
        <RecentActivity />
      </div>
    </div>
  );
}
