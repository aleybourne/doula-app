
import React from "react";
import { Button } from "@/components/ui/button";
import { ArchiveIcon } from "lucide-react";

interface ArchiveToggleProps {
  showArchived: boolean;
  onToggle: () => void;
}

const ArchiveToggle: React.FC<ArchiveToggleProps> = ({ showArchived, onToggle }) => {
  return (
    <div className="flex justify-end mb-4">
      <Button 
        variant={showArchived ? "default" : "outline"}
        size="sm" 
        onClick={onToggle}
        className="flex items-center gap-1"
      >
        <ArchiveIcon className="h-4 w-4" />
        {showArchived ? "Show Active" : "Show Archived"}
      </Button>
    </div>
  );
};

export default ArchiveToggle;
