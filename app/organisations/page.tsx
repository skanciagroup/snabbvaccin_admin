"use client";
import Drawer from "@/components/Drawer";
import NewOrganisation from "@/components/forms/NewOrganisation";
import BreadcrumbBlock from "@/components/layout/BreadcrumbBlock";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableBlock from "@/components/layout/TableBlock";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useOrganisationStore from "@/store/organisationStore";
import EditOrganisation from "@/components/forms/EditOrganisation";
import { Organisation as OrganisationType } from "@/types/database";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import useLoadingStore from "@/store/loadingStore";
import { organisationService } from "@/services/organisationService";
import { successToast } from "@/utils/toastUtils";
 
const Organisations = () => {
  const { t } = useTranslation();
  const { organisations, setOrganisations } = useOrganisationStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<OrganisationType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrganisations, setFilteredOrganisations] = useState<
    OrganisationType[]
  >([]);
  const { loading, setLoading } = useLoadingStore();

  useEffect(() => {
    const loadOrganisations = async () => {
      setLoading(true);
      try {
        const fetchedOrganisations =
          await organisationService.fetchOrganisations();
        const validOrganisations = fetchedOrganisations.filter(
          (org) => org.id !== undefined,
        ) as OrganisationType[];
        setOrganisations(validOrganisations);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrganisations();
  }, [setOrganisations, setLoading]);

  useEffect(() => {
    const filtered = organisations.filter((org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredOrganisations(filtered);
  }, [searchTerm, organisations]);

  const headers = ["S.No", "Name"];

  const handleDelete = async (row: OrganisationType) => {
    try {
      setLoading(true);
      const idToDelete = Number(row.id);
      await organisationService.deleteOrganisation(idToDelete);
      setOrganisations(organisations.filter((org) => org.id !== idToDelete));
      toast.success("Organisation deleted successfully");
    } catch (error) {
      console.error("Error deleting organisation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: OrganisationType) => {
    setSelectedOrganisation(row);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedOrganisation(null);
  };

  const handleToggleDisabled = async (rowId: number) => {
    try {
      const response = await fetch("/api/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: "organisations", 
          row: { id: rowId },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Log the error response
        throw new Error(
          `Failed to toggle disabled state: ${errorData.message}`,
        );
      }
      // Optionally, refresh your data or update the state
      const updatedBuses = await organisationService.fetchOrganisations(); // Fetch updated buses
      setOrganisations(updatedBuses); // Update the state with the new data
      successToast("Organisation updated successfully");
    } catch (error) {
      console.error("Error toggling disabled state:", error);
    }
  };

  return (
    <div className="p-6">
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        {isEditMode && selectedOrganisation ? (
          <EditOrganisation
            organisation={selectedOrganisation}
            onClose={handleDrawerClose}
          />
        ) : (
          <NewOrganisation onClose={handleDrawerClose} />
        )}
      </Drawer>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("sidebar.organisations")}
            </h1>
            <BreadcrumbBlock
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Organisations", href: "" },
              ]}
            />
          </div>

          <Separator className="my-6 h-[1px] bg-primary/30 rounded-xl" />

          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-0">
                <CardTitle className="text-secondary p-0">Total</CardTitle>
                <span className="text-xl text-secondary font-semibold">
                  {organisations.length}
                </span>
              </CardContent>
            </Card>

            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-[7px] text-white"
            >
              Add Organisation
            </Button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search organisations..."
          />

          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredOrganisations.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredOrganisations}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleDisabled={handleToggleDisabled}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No organisations found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Organisations;
