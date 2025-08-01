import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useSearchParams } from "react-router-dom";

const filterOptions = [
  { value: null, label: "All Clients" },
  { value: "new", label: "New Clients (Last Week)" },
  { value: "upcoming", label: "Upcoming Births" },
  { value: "due-date-asc", label: "Due Date (Earliest First)" },
  { value: "due-date-desc", label: "Due Date (Latest First)" },
  { value: "recently-added", label: "Recently Added" },
];

const FilterDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter");

  const handleFilterChange = (filterValue: string | null) => {
    if (filterValue) {
      navigate(`/clients?filter=${filterValue}`);
    } else {
      navigate("/clients");
    }
  };

  const currentOption = filterOptions.find(option => option.value === currentFilter) || filterOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ml-2 h-10 px-3 border-[#DADADA] bg-[#F9F9F9] hover:bg-[#EEEEEE] text-gray-700"
        >
          <span className="text-sm truncate max-w-[120px]">{currentOption.label}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-md">
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value || "all"}
            onClick={() => handleFilterChange(option.value)}
            className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
          >
            <span>{option.label}</span>
            {currentFilter === option.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;