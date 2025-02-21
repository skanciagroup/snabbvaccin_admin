"use client";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Schemas = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <div className="main_container flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {t("sidebar.schemas")}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Schemas;