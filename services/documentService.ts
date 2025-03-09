import { Document, DocumentForm, DocumentEditForm } from "@/types/database"; // Adjust the import based on your types
import { errorToast } from "@/utils/toastUtils";

const API_URL = "/api/document"; // Adjust the API URL as needed

export const documentService = {
  fetchDocuments: async (): Promise<Document[]> => {
    const response = await fetch(`${API_URL}/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
    return response.json();
  },

  createDocument: async (documentData: DocumentForm) => {
    console.log("documentData", documentData);
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: documentData.name,
        file_type: documentData.file_type,
        file: documentData.file,
      }), // Only send the name
    });

    if (response.status === 409) {
      errorToast("A document with the same name already exists."); // Toast for conflict
      throw new Error(
        "Conflict: A document with the same name already exists.",
      );
    }
    if (!response.ok) {
      throw new Error("Failed to create document");
    }
    return response.json(); // Return the response which may include the document ID or other details
  },

  uploadDocumentFile: async (documentId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file

    const response = await fetch(`${API_URL}/upload/${documentId}`, {
      method: "POST",
      body: formData, // Send the FormData object
    });

    if (!response.ok) {
      throw new Error("Failed to upload document file");
    }
    return response.json();
  },

  editDocument: async (id: number, documentData: DocumentEditForm) => {
    const response = await fetch(`${API_URL}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...documentData }),
    });
    if (response.status === 409) {
      errorToast("A document with the same name already exists."); // Toast for conflict
      throw new Error(
        "Conflict: A document with the same name already exists.",
      );
    }
    if (!response.ok) {
      throw new Error("Failed to update document");
    }
    return response.json();
  },

  deleteDocument: async (documentId: number) => {
    const response = await fetch(`${API_URL}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: documentId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete document");
    }
    return response.json();
  },
};
