
import React from "react";
import { useNavigate } from "react-router-dom";

export const ActionGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (filter: string) => {
    console.log(`ActionGrid: Navigating to /clients with filter=${filter}`);
    navigate(`/clients?filter=${filter}`);
  };

  return (
    <section className="grid grid-cols-3 gap-x-6 gap-y-6 justify-items-center mx-0 my-5">
      <button
        className="bg-green-200 rounded-xl h-24 w-24 flex flex-col items-center justify-center"
        onClick={() => handleNavigate("new")}
      >
        <div className="text-2xl font-bold">1</div>
        <div className="text-sm">New Clients</div>
      </button>
      <button
        className="bg-red-200 rounded-xl h-24 w-24 flex flex-col items-center justify-center"
        onClick={() => handleNavigate("upcoming")}
      >
        <div className="text-2xl font-bold">2</div>
        <div className="text-sm">Upcoming Births</div>
      </button>
      <button
        className="bg-purple-200 rounded-xl h-24 w-24 flex flex-col items-center justify-center"
        onClick={() => handleNavigate("active")}
      >
        <div className="text-2xl font-bold">7</div>
        <div className="text-sm">Active Clients</div>
      </button>
    </section>
  );
};
