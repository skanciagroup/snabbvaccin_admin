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
import useOrganisationStore from "@/store/organisationStore"; // Import the Zustand store
import EditOrganisation from "@/components/forms/EditOrganisation";
import { Organisation as OrganisationType } from "@/types/database";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar"; // Import the SearchBar component
import useLoadingStore from "@/store/loadingStore"; // Import the loading store
const Organisations = () => {
  const { t } = useTranslation();
  const { organisations, fetchOrganisations } = useOrganisationStore();
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
    fetchOrganisations();
    setLoading(false);
  }, [fetchOrganisations, setLoading]);

  useEffect(() => {
    const filtered = organisations.filter((org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredOrganisations(filtered);
  }, [searchTerm, organisations]);

  const headers = ["S.No", "Name"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (row: Record<string, any>) => {
    const organisation = row as OrganisationType;
    try {
      setLoading(true);
      const response = await fetch("/api/organisation/delete", {
        method: "DELETE",
        body: JSON.stringify({ id: organisation.id }),
      });
      if (!response.ok) throw new Error("Failed to delete");
      fetchOrganisations();
      setLoading(false);
      toast.success("Organisation deleted successfully");
    } catch (error) {
      console.error("Error deleting organisation:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (row: Record<string, any>) => {
    const organisation = row as OrganisationType;
    setSelectedOrganisation(organisation);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedOrganisation(null);
  };

  return (
    <div className="p-6">
      {/* Drawer */}
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
          {/* Header Section */}
          
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

          {/* Stats and Action Button */}
          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px]  hover:shadow-lg">
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
        placeholder="Search organisations..." // Custom placeholder
      />
          {/* Table Section */}
          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredOrganisations.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredOrganisations}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No organizations found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Organisations;
