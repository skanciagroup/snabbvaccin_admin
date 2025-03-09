import { create } from "zustand";
import { Document } from "@/types/database"; // Adjust the import based on your types
import { documentService } from "@/services/documentService"; // Import the document service

interface DocumentStore {
  documents: Document[];
  loading: boolean;
  setDocuments: (documents: Document[]) => void;
  fetchDocuments: () => Promise<void>;
  addDocument: (document: Document) => void;
  updateDocument: (updatedDocument: Document) => void;
  deleteDocument: (documentId: number) => void;
}

const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  loading: false,
  setDocuments: (documents) => set({ documents }),
  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const documents = await documentService.fetchDocuments();
      set({ documents });
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      set({ loading: false });
    }
  },

  addDocument: (document) => {
    set((state) => ({ documents: [...state.documents, document] }));
  },

  updateDocument: (updatedDocument) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === updatedDocument.id ? updatedDocument : doc,
      ),
    }));
  },

  deleteDocument: (documentId) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== documentId),
    }));
  },
}));

export default useDocumentStore;
