
import React from "react";

const ClientBirthPlans: React.FC = () => {
  return (
    <div className="mt-3 space-y-2 px-2">
      <div className="rounded-xl bg-white shadow py-3 px-3 flex justify-between items-center text-gray-800">
        <span>Spontaneous Labor: <span className="font-semibold">Unmedicated</span></span>
      </div>
      <div className="rounded-xl bg-white shadow py-3 px-3 flex justify-between items-center text-gray-800 opacity-60">
        <span>Spontaneous Labor: Intervention</span>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <circle cx={10} cy={10} r={9} stroke="#8E9196" strokeWidth="2"/>
          <path d="M6 10.5L9 13l5-5" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="rounded-xl bg-white shadow py-3 px-3 flex justify-between items-center text-gray-800 opacity-60">
        <span>Cesarean Section</span>
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <circle cx={10} cy={10} r={9} stroke="#8E9196" strokeWidth="2"/>
          <path d="M6 10.5L9 13l5-5" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default ClientBirthPlans;
