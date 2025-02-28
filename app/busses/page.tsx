"use client";
import Drawer from "@/components/Drawer";
import BreadcrumbBlock from "@/components/layout/BreadcrumbBlock";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableBlock from "@/components/layout/TableBlock";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useBusStore from "@/store/busStore";
import { Bus } from "@/types/database";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import EditBus from "@/components/forms/EditBus";
import NewBus from "@/components/forms/NewBus";
import useLoadingStore from "@/store/loadingStore";


const Buses = () => {
  const { t } = useTranslation();
  const { buses, fetchBuses } = useBusStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const { loading, setLoading } = useLoadingStore();
  
  useEffect(() => {
    fetchBuses();
    
  }, [fetchBuses, setLoading]);
  
  useEffect(() => {
    const filtered = buses.filter(
      (bus) =>
        bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.reg_no.toLowerCase().includes(searchTerm.toLowerCase())||
        bus.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuses(filtered);
    setLoading(false);
  }, [searchTerm, buses, setLoading]);

  const headers = ["S.No", "Name", "REG_NO", "TYPE"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (row: Record<string, any>) => {
    const bus = row as Bus;
    try {
      setLoading(true)
      const response = await fetch("/api/bus/delete", {
        method: "DELETE",
        body: JSON.stringify({ id: bus.id }),
      });
      if (!response.ok) throw new Error("Failed to delete");
      fetchBuses();
      setLoading(false)
      toast.success("Bus deleted successfully");
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (row: Record<string, any>) => {
    const bus = row as Bus;
    setSelectedBus(bus);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedBus(null);
  };

  return (
    <div className="p-6">
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        {isEditMode && selectedBus ? (
          <EditBus bus={selectedBus} onClose={handleDrawerClose} />
        ) : (
          <NewBus onClose={handleDrawerClose} />
        )}
      </Drawer>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("sidebar.busses")}
            </h1>
            <BreadcrumbBlock
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Buses", href: "" },
              ]}
            />
          </div>

          <Separator className="my-6 h-[1px] bg-primary/30 rounded-xl" />

          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-0">
                <CardTitle className="text-secondary p-0">Total</CardTitle>
                <span className="text-xl text-secondary font-semibold">
                  {buses.length}
                </span>
              </CardContent>
            </Card>

            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-[7px] text-white"
            >
              Add Bus
            </Button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search buses..."
          />

          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredBuses.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredBuses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No buses found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
