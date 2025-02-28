"use client";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import useLoadingStore from "@/store/loadingStore";

const Documents = () => {
  const { t } = useTranslation();
  const { loading, setLoading } = useLoadingStore();

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
        <div className="main_container flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {t("sidebar.documents")}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Documents;
