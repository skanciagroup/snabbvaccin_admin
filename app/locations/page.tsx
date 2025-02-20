'use client'
import React from 'react'
import { useTranslation } from "react-i18next";

const Location = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
        {t("sidebar.locations")}
        </h1>
      </div>
    </div>
  )
}

export default Location
