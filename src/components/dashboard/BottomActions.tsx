
import React from "react";
import { bottomActions } from "./actionData";

export const BottomActions: React.FC = () => {
  const handleActionClick = (label: string) => {
    console.log(`Bottom Action clicked: ${label}`);
  };

  return (
    <section className="flex justify-between px-2 py-4 gap-x-4 border-t border-gray-100 mt-6">
      {bottomActions.map((action) => (
        <button
          key={action.label}
          onClick={() => handleActionClick(action.label)}
          className={`${action.bgColor} rounded-xl flex flex-col items-center justify-center w-[110px] h-[110px] shadow-sm`}
          type="button"
        >
          <img 
            src={action.icon} 
            alt={action.altText} 
            className="w-10 h-10 mb-2" 
          />
          <span className="font-medium text-base">{action.label}</span>
        </button>
      ))}
    </section>
  );
};
