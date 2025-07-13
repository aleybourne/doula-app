import React from "react";
import { Baby } from "lucide-react";
import { DetailedPostpartumNotesDialog } from "./DetailedPostpartumNotesDialog";
import { updateClient } from "../store/clientActions";

interface PostpartumNotesProps {
  client: any; // Will be properly typed later if needed
}

const PostpartumNotes: React.FC<PostpartumNotesProps> = ({ client }) => {
  const handleSaveDetailedNotes = async (updatedClient: any) => {
    try {
      await updateClient(updatedClient);
    } catch (error) {
      console.error("Failed to save detailed notes:", error);
    }
  };

  return (
    <div className="px-4 py-3" data-testid="postpartum-notes">
      <DetailedPostpartumNotesDialog
        client={client}
        onSave={handleSaveDetailedNotes}
      >
        <button className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500 rounded-md h-11 px-8 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
          <Baby className="h-5 w-5" />
          <span>Postpartum & Delivery Notes</span>
        </button>
      </DetailedPostpartumNotesDialog>
    </div>
  );
};

export default PostpartumNotes;