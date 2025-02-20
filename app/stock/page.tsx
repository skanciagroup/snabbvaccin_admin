"use client";
import { useTranslation } from "react-i18next";

const Stock = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {t("sidebar.stock")}
        </h1>
      </div>
    </div>
  );
};

export default Stock;