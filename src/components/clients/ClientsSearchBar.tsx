
import React from "react";
import { Search, Filter } from "lucide-react";

interface ClientsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ClientsSearchBar: React.FC<ClientsSearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mt-2 mb-4 flex items-center relative">
      <input
        type="text"
        placeholder="Search…"
        className="w-full rounded-lg border border-[#DADADA] bg-[#F9F9F9] text-base px-4 py-2 pr-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Search
        size={22}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <Filter
        size={28}
        className="absolute right-[-38px] top-1/2 -translate-y-1/2 text-gray-700"
      />
    </div>
  );
};

export default ClientsSearchBar;
