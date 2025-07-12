import React from "react";
import { Button } from "../../ui/button";
import { Baby, Heart, Calendar } from "lucide-react";

interface PostpartumNotesProps {
  client: any; // Will be properly typed later if needed
}

const PostpartumNotes: React.FC<PostpartumNotesProps> = ({ client }) => {
  const handlePostpartum = () => {
    // TODO: Implement postpartum notes functionality
    console.log("Opening postpartum notes for:", client.name);
  };

  return (
    <div className="px-4 py-3">
      <Button
        onClick={handlePostpartum}
        className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
        size="lg"
      >
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          <span>Postpartum Notes</span>
        </div>
      </Button>
      
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-2">
          <Heart className="h-4 w-4" />
          Postpartum Care
        </div>
        <p className="text-green-600 text-sm">
          Recovery tracking, feeding support, and newborn care guidance.
        </p>
        {client.deliveryTime && (
          <p className="text-green-500 text-xs mt-1">
            <Calendar className="h-3 w-3 inline mr-1" />
            Delivered: {new Date(client.deliveryTime).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostpartumNotes;