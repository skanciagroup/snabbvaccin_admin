// providers/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "bg-white text-black px-4 py-3 rounded-full shadow-lg",
          duration: 3000,
          success: {
            className: "!bg-green-50 !text-green-600 text-sm text-secondary",
            iconTheme: {
              primary: "#16a34a",
              secondary: "#fff",
            },
          },
          error: {
            className: "!bg-red-50 !text-red-600",
          },
          loading: {
            className: "!bg-blue-50 !text-blue-600",
          },
        }}
      />
      {children} {/* Render children here */}
    </>
  );
};

export default ToastProvider;