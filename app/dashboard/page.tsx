"use client";
import { useTranslation } from "react-i18next";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import useLanguageChange from "@/hooks/useLanguageChange";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import useLoadingStore from "@/store/loadingStore";

export default function DashboardPage() {
  const { t } = useTranslation(); // Use the translation hook
  useLanguageChange(); // Call the custom hook
  const {loading, setLoading} = useLoadingStore();

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [setLoading]);

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <div className="main_container space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("dashboard.title")}
            </h1>
          </div>
          <StatsCards />
          <div className="grid gap-6 md:grid-cols-2">
            <OverviewChart />
            <RecentActivity />
          </div>
        </div>
      )}
    </div>
  );
}
