"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DocumentForm } from "@/types/database"; // Adjust this import as necessary
import { Button } from "@/components/ui/button";
import useLoadingStore from "@/store/loadingStore";
import { Input } from "@/components/ui/input";
import useDocumentStore from "@/store/documentStore"; // Adjust this import as necessary
import { useState } from "react";
import toast from "react-hot-toast";
import { documentService } from "@/services/documentService"; // Adjust this import as necessary
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/public/loading.gif";
import Image from "next/image";

// Define the Yup schema for document validation
const schema = yup.object().shape({
  name: yup.string().required("Document name is required"),
  file: yup.mixed().nullable().required("File is required"),
  file_type: yup.string().optional(),
});

interface NewDocumentProps {
  onClose: () => void;
}

const NewDocument: React.FC<NewDocumentProps> = ({ onClose }) => {
  const { loading, setLoading } = useLoadingStore();
  const { fetchDocuments } = useDocumentStore(); // Adjust this as necessary
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DocumentForm>({
    // @ts-expect-error Resolver type mismatch with DocumentForm
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      file: undefined,
      file_type: "",
    },
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const onSubmit = async (data: DocumentForm) => {
    setLoading(true);
    console.log("data", data.file);
    try {
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = fileInput.files?.[0]; // Get the selected file

      if (!file) {
        throw new Error("File is required");
      }

      console.log("file", file.type);
      console.log("data", data);

      // Create the document first
      const result = await documentService.createDocument({
        name: data.name,
        file_type: `${file.type}`,
        file,
      }); // Pass only the name
      console.log("result", result);
      // Now upload the document file
      //await documentService.uploadDocumentFile(documentId, file);

      // Show success message
      setMessage({
        type: "success",
        text: "Document created successfully",
      });
      fetchDocuments();
      const { error: uploadError } = await supabase.storage
        .from("snabbvaccin")
        .upload(result.filename, file);
      console.log("uploadError", uploadError);
      toast.success("Document created successfully");
      onClose();
      reset();
    } catch (error) {
      console.error("Error creating document:", error);
      setMessage({
        type: "error",
        text: "An error occurred while creating the document.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <Input
          {...control.register("name")}
          type="text"
          placeholder="Document Name"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div>
        <input
          type="file"
          {...control.register("file")}
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
        {errors.file && <p className="error-message">{errors.file.message}</p>}
      </div>
      <div className="form-button-div">
        <Button
          type="submit"
          variant="default"
          disabled={loading}
          className="mt-4 w-full text-white py-2 px-4 rounded"
        >
           {loading ? (
            <div className="flex items-center">
              <Image src={Loader} width={40} height={40} alt="loading" />
              Uploading Document...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="mt-4 w-full text-primary py-2 px-4 rounded"
        >
          Cancel
        </Button>
      </div>

      {message.text && (
        <p
          className={
            message.type === "success" ? "text-primary" : "error-message"
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default NewDocument;
