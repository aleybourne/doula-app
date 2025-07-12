import React from "react";
import { Button } from "../../ui/button";
import { Activity, Clock, Heart } from "lucide-react";

interface ActiveLaborNotesProps {
  client: any; // Will be properly typed later if needed
}

const ActiveLaborNotes: React.FC<ActiveLaborNotesProps> = ({ client }) => {
  const handleActiveLabor = () => {
    // TODO: Implement active labor notes functionality
    console.log("Opening active labor notes for:", client.name);
  };

  return (
    <div className="px-4 py-3">
      <Button
        onClick={handleActiveLabor}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
        size="lg"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <span>Active Labor Notes</span>
        </div>
      </Button>
      
      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 text-orange-700 text-sm font-medium mb-2">
          <Clock className="h-4 w-4" />
          Labor in Progress
        </div>
        <p className="text-orange-600 text-sm">
          Track contractions, monitor progress, and document labor milestones.
        </p>
      </div>
    </div>
  );
};

export default ActiveLaborNotes;