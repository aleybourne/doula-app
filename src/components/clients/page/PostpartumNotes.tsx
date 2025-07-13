import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Baby, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { DetailedPostpartumNotesDialog } from "./DetailedPostpartumNotesDialog";
import { updateClient } from "../store/clientActions";

interface PostpartumNotesProps {
  client: any; // Will be properly typed later if needed
}

const PostpartumNotes: React.FC<PostpartumNotesProps> = ({ client }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSaveDetailedNotes = async (updatedClient: any) => {
    try {
      await updateClient(updatedClient);
    } catch (error) {
      console.error("Failed to save detailed notes:", error);
    }
  };

  return (
    <div className="px-4 py-3" data-testid="postpartum-notes">
      {/* Header button that toggles the section */}
      <Button
        onClick={handleToggle}
        className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500 justify-between"
        size="lg"
      >
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          <span>Postpartum & Delivery Notes</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      {/* Collapsible content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-2">
            <Heart className="h-4 w-4" />
            Delivery & Postpartum Care
          </div>
          
          {/* Delivery Details */}
          {client.deliveryTime && (
            <div className="mb-3 p-2 bg-white rounded border border-green-100">
              <div className="text-green-700 text-xs font-medium mb-1">Delivery Details</div>
              <div className="grid grid-cols-2 gap-1 text-xs text-green-600">
                <div>Time: {new Date(client.deliveryTime).toLocaleString()}</div>
                {client.deliveryWeight && <div>Weight: {client.deliveryWeight}</div>}
                {client.deliveryLength && <div>Length: {client.deliveryLength}</div>}
                {client.deliveryHeadCircumference && <div>Head Circumference: {client.deliveryHeadCircumference}</div>}
              </div>
            </div>
          )}
          
          <p className="text-green-600 text-sm mb-3">
            Recovery tracking, feeding support, and newborn care guidance.
          </p>
          
          {/* Action button for detailed notes */}
          <DetailedPostpartumNotesDialog
            client={client}
            onSave={handleSaveDetailedNotes}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full border-green-300 text-green-700 hover:bg-green-100"
            >
              Open Detailed Notes
            </Button>
          </DetailedPostpartumNotesDialog>
        </div>
      </div>
    </div>
  );
};

export default PostpartumNotes;