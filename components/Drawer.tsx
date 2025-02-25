import React from "react";
import { RxCrossCircled } from "react-icons/rx";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-primary bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed  right-0 top-0 h-full w-[90%] md:w-1/2 bg-white z-40 transition-transform transform shadow-lg rounded-l-lg p-6 duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
      >
        <RxCrossCircled
          className="text-red-600 hover:text-red-700 transition-colors duration-200"
          size={18}
          onClick={onClose}
        />
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
