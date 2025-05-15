import React from "react";
import { useNavigate } from "react-router-dom";

export const ActionGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-3 gap-x-6 gap-y-6 justify-items-center mx-0 my-5">
      {/* Removed duplicate buttons for New Clients, Upcoming Births, and Active Clients */}
      {/* This section is now empty - consider replacing with other actions or removing if not needed */}
    </section>
  );
};
