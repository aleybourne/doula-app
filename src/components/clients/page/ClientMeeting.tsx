
import React from "react";
import { Plus } from "lucide-react";

const ClientMeeting = () => {
  return (
    <div className="rounded-xl bg-[#F6F6F7] px-4 py-3 mx-2 mb-3 mt-1">
      <div className="text-gray-800 font-medium mb-1 text-sm">Next Meeting</div>
      <div className="rounded-lg bg-white px-4 py-3 shadow flex items-center">
        <div className="border-l-4 border-[#A085E9] pr-2 mr-3 h-8" />
        <div>
          <div className="font-semibold text-[#2B2939] text-base mb-0.5">Client Check-in</div>
          <div className="text-xs text-gray-500">30min Zoom meeting</div>
          <div className="text-xs text-gray-400 mt-0.5">11-11:30am</div>
        </div>
      </div>
      <button className="rounded-full bg-[#FDE1D3] absolute right-8 mt-[-40px] p-2 shadow" aria-label="Add Meeting">
        <Plus className="w-[22px] h-[22px] text-[#F499B7]" />
      </button>
    </div>
  );
};

export default ClientMeeting;
