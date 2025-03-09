import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/types/database"; // Adjust the import based on your types
import { documentService } from "@/services/documentService"; // Import the document service
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import useDocumentStore from "@/store/documentStore";
import useLoadingStore from "@/store/loadingStore";
import Loader from "@/public/loading.gif";
import { v4 as uuidv4 } from "uuid";

interface EditDocumentProps {
  document: Document;
  onClose: () => void;
}

const EditDocument: React.FC<EditDocumentProps> = ({ document, onClose }) => {
  const [name, setName] = useState(document.name);
  const [file, setFile] = useState<File | null>(null);
  const { fetchDocuments } = useDocumentStore();
  const { loading, setLoading } = useLoadingStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const getDownloadLink = (filename: string) => {
    const { data } = supabase.storage
      .from("snabbvaccin")
      .getPublicUrl(filename);

    return data?.publicUrl;
  };

  const handleDownload = () => {
    const downloadUrl = getDownloadLink(document.filename as string);
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await documentService.editDocument(document.id, {
        name,
        file_type: file?.type || document.file_type,
      });

      if (response.status === 200) {
        if (file) {
          console.log("Handling new file upload...");

          // Delete old file first
          const { error: deleteError } = await supabase.storage
            .from("snabbvaccin")
            .remove([document.filename as string]);

          if (deleteError) {
            console.error("Error deleting old file:", deleteError);
            throw deleteError;
          }

          // Generate new filename
          const formattedName = name.toLowerCase().replace(/\s+/g, "_");
          const newFilename = `${formattedName}_${uuidv4()}.${file.type
            .split("/")
            .pop()}`;
          console.log("New filename:", newFilename);

          // Upload new file with new filename
          const { error: uploadError } = await supabase.storage
            .from("snabbvaccin")
            .upload(newFilename, file);

          if (uploadError) {
            console.error("Error uploading new file:", uploadError);
            throw uploadError;
          }

          // Update filename in database through API
          const updateResponse = await fetch("/api/document/updateFilename", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: document.id,
              filename: newFilename,
            }),
          });

          if (!updateResponse.ok) {
            throw new Error("Failed to update filename in database");
          }
        }

        toast.success("Document updated successfully!");
        fetchDocuments();
        onClose();
      }
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document.");
    } finally {
      setLoading(false);
    }
  };

  const isImage = document.file_type?.startsWith("image/");
  const imageUrl = isImage
    ? getDownloadLink(document.filename as string)
    : null;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Document Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input type="file" onChange={handleFileChange} />
        <div className="form-button-div">
        <Button type="submit" variant="default"
          className="mt-4 w-full text-white py-2 px-4 rounded">
            {loading ? (
              <div className="flex items-center">
                <Image src={Loader} width={40} height={40} alt="loading" />
                Updating Document...
              </div>
            ) : (
              "Update"
            )}
          </Button>
          
          <Button type="button" variant="outline"
           className="mt-4 w-full text-primary py-2 px-4 rounded"

          onClick={onClose}>
            Cancel
          </Button>
        </div>
        <Button type="button" variant="outline"
         className="mt-4 w-full text-primary py-2 px-4 rounded"
        onClick={handleDownload}>
            Download
          </Button>
      </form>

      {isImage && imageUrl && (
        <div className="mt-4">
          <Image
            src={imageUrl}
            alt={document.name}
            className="w-[200px] rounded-lg shadow-md"
            width={150}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default EditDocument;
