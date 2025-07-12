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
    <div className="px-4 py-3" data-testid="postpartum-notes">
      <Button
        onClick={handlePostpartum}
        className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
        size="lg"
      >
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          <span>Postpartum & Delivery Notes</span>
        </div>
      </Button>
      
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
        
        <p className="text-green-600 text-sm">
          Recovery tracking, feeding support, and newborn care guidance.
        </p>
      </div>
    </div>
  );
};

export default PostpartumNotes;