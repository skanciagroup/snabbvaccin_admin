"use client";
import Drawer from "@/components/Drawer";
import NewUser from "@/components/forms/NewUser";
import BreadcrumbBlock from "@/components/layout/BreadcrumbBlock";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const User = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
  };

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <div className="main_container flex flex-col items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {t("sidebar.users")}
            </h1>
            <BreadcrumbBlock breadcrumbs={[{ label: "Home", href: "/" }, { label: "Users", href: "" }]} />
            <Separator className="my-2 h-[2px] bg-primary rounded-xl" />
          <button
            onClick={toggleDrawer} // Button to open/close the drawer
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
          >
            Add User
          </button>
          <div>
            <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
              <NewUser />
            </Drawer>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
