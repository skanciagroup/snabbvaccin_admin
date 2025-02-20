'use client'
import React from 'react'
import { useTranslation } from "react-i18next";

const Vaccines = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight text-primary">
        {t("sidebar.vaccines")}
      </h2>
    </div>
  </div>
  )
}

export default Vaccines
