"use client";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {t("sidebar.analytics")}
        </h1>
      </div>
    </div>
  );
};

export default Analytics;