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
import { Document } from "@/types/database";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import useLoadingStore from "@/store/loadingStore";
import { documentService } from "@/services/documentService";
import NewDocument from "@/components/forms/NewDocument";
import EditDocument from "@/components/forms/EditDocument";
import useDocumentStore from "@/store/documentStore";
import { successToast } from "@/utils/toastUtils";

const Buses = () => {
  const { t } = useTranslation();
  const { documents, setDocuments } = useDocumentStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const { loading, setLoading } = useLoadingStore();

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const fetchedDocuments = await documentService.fetchDocuments();
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, [setDocuments, setLoading]);

  useEffect(() => {
    const filtered = documents.filter(
      (document) =>
        document.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const headers = ["S.No", "Name", "FILE_TYPE"];

  const handleDelete = async (row: Document) => {
    try {
      setLoading(true);
      await documentService.deleteDocument(row.id!);
      setDocuments(documents.filter((document) => document.id !== row.id));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: Document) => {
    setSelectedDocument(row);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedDocument(null);
  };

  const handleToggleDisabled = async (rowId: number) => {
    try {
      const response = await fetch("/api/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: "documents", 
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
      const updatedBuses = await documentService.fetchDocuments(); // Fetch updated buses
      setDocuments(updatedBuses); // Update the state with the new data
      successToast("Document updated successfully");
    } catch (error) {
      console.error("Error toggling disabled state:", error);
    }
  };

  return (
    <div className="p-6">
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        {isEditMode && selectedDocument ? (
          <EditDocument document={selectedDocument} onClose={handleDrawerClose} />
        ) : (
          <NewDocument onClose={handleDrawerClose} />
        )}
      </Drawer>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("sidebar.documents")}
            </h1>
            <BreadcrumbBlock
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Documents", href: "" },
              ]}
            />
          </div>

          <Separator className="my-6 h-[1px] bg-primary/30 rounded-xl" />

          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-0">
                <CardTitle className="text-secondary p-0">Total</CardTitle>
                <span className="text-xl text-secondary font-semibold">
                  {documents.length}
                </span>
              </CardContent>
            </Card>

            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-[7px] text-white"
            >
              Add Document
            </Button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search documents..."
          />

          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredDocuments.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredDocuments}
                onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDisabled={handleToggleDisabled}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No Documents found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
