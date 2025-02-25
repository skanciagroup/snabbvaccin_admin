import React from "react";

const Loader = () => {
  return (
    <div className="h-screen inset-0 flex items-center justify-center  z-50">
      <div className="w-20 h-20 rounded-full bg-green-500 animate-ping"></div>
    </div>
  );
};

export default Loader;
