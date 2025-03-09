"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Location } from "@/types/database";
import useLocationStore from "@/store/locationStore";
import useLoadingStore from "@/store/loadingStore";
import TableBlock from "@/components/layout/TableBlock";
import { successToast } from "@/utils/toastUtils";
import { locationService } from "@/services/locationService";
import Drawer from "@/components/Drawer";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import BreadcrumbBlock from "@/components/layout/BreadcrumbBlock";
import useDisabledStore from "@/store/disabledStore";
import EditLocation from "@/components/forms/EditLocation";
import NewLocation from "@/components/forms/NewLocation";

const Locations = () => {
  const { t } = useTranslation();
  const { locations, setLocations } = useLocationStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const { loading, setLoading } = useLoadingStore();
  const { setDisabledSwitch } = useDisabledStore();

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const fetchedLocations = await locationService.fetchLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, [setLocations, setLoading]);

  useEffect(() => {
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  const headers = ["S.No", "Name", "MVID", "Address"];

  const handleDelete = async (row: Location) => {
    try {
      setLoading(true);
      await locationService.deleteLocation(row.id!);
      setLocations(locations.filter((location) => location.id !== row.id));
      successToast("Location deleted successfully");
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: Location) => {
    setSelectedLocation(row);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedLocation(null);
  };

  const handleToggleDisabled = async (rowId: number) => {
    try {
      setDisabledSwitch(true);
      const response = await fetch("/api/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: "locations",
          row: { id: rowId },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to toggle disabled state: ${errorData.message}`,
        );
      }
      const updatedLocations = await locationService.fetchLocations();
      setLocations(updatedLocations);
      setDisabledSwitch(false);
      successToast("Location updated successfully");
    } catch (error) {
      console.error("Error toggling disabled state:", error);
    }
  };

  return (
    <div className="p-6">
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        {isEditMode && selectedLocation ? (
          <EditLocation
            location={selectedLocation}
            onClose={handleDrawerClose}
          />
        ) : (
          <NewLocation onClose={handleDrawerClose} />
        )}
      </Drawer>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("sidebar.locations")}
            </h1>
            <BreadcrumbBlock
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Locations", href: "" },
              ]}
            />
          </div>

          <Separator className="my-6 h-[1px] bg-primary/30 rounded-xl" />

          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-0">
                <CardTitle className="text-secondary p-0">Total</CardTitle>
                <span className="text-xl text-secondary font-semibold">
                  {locations.length}
                </span>
              </CardContent>
            </Card>

            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-[7px] text-white"
            >
              Add Location
            </Button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search locations..."
          />

          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredLocations.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredLocations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleDisabled={handleToggleDisabled}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No locations found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
