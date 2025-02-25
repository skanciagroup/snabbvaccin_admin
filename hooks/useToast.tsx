import React, { createContext, useContext, useState } from "react";

interface Toast {
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Toast) => {
    console.log("Adding new toast:", newToast);
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[9999] pointer-events-none">
        {toasts.map((t, index) => (
          <div
            key={index}
            className="toast-enter bg-primary text-white p-4 rounded-lg shadow-lg min-w-[300px] pointer-events-auto"
          >
            <h4 className="font-bold">{t.title}</h4>
            {t.description && <p className="mt-1 text-sm">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
