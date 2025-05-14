
import React from "react";

const ClientProgressBar: React.FC = () => {
  return (
    <div className="px-3 mt-2 flex items-center gap-2">
      <span className="bg-[#A085E9] rounded-full p-2 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
          <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-[#7E69AB]">Birth Plans</span>
          <span className="text-xs text-gray-500">33%</span>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#A7EBB1]" style={{ width: "33%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ClientProgressBar;
