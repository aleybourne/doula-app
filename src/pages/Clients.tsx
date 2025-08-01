
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientsHeader from "@/components/clients/ClientsHeader";
import ClientsSearchBar from "@/components/clients/ClientsSearchBar";
import ClientList from "@/components/clients/ClientList";
import { useClientsStore } from "@/components/clients/hooks/useClientsStore";

const BG_COLOR = "bg-white";

const Clients: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { clients } = useClientsStore();
  const [filter, setFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const currentFilter = searchParams.get("filter");
    setFilter(currentFilter);
  }, [searchParams]);
  
  // Log filter values to help with debugging
  useEffect(() => {
    console.log("Clients page filter value:", filter);
  }, [filter]);
  
  // Remove the old direct Firestore query that used the wrong path structure
  // The clients are now loaded through the proper store mechanism

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilter = () => {
    console.log("Clearing filter");
    // Use navigate instead of reload to maintain React state
    navigate("/clients");
  };

  // Generate appropriate title based on the active filter
  const getFilterTitle = () => {
    switch (filter) {
      case "new": return "New Clients (Last Week)";
      case "upcoming": return "Upcoming Births";
      case "due-date-asc": return "Due Date (Earliest First)";
      case "due-date-desc": return "Due Date (Latest First)";
      case "recently-added": return "Recently Added";
      default: return "All Clients";
    }
  };

  return (
    <div className={`${BG_COLOR} min-h-screen pb-16 px-3`}>
      <ClientsHeader title={filter ? getFilterTitle() : "Clients"} />
      {filter && (
        <div className="flex items-center justify-between text-lg font-medium mb-4 mt-2 text-gray-700">
          <span>{getFilterTitle()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="ml-2 h-8 w-8 p-0"
            aria-label="Clear filter"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <ClientsSearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <ClientList 
        key={`clientlist-${filter || "all"}`}
        searchQuery={searchQuery}
        filter={filter || undefined}
      />
    </div>
  );
};

export default Clients;
