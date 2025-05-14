
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  isEditing: boolean;
  editingClient: any;
  handleChange: (field: string, value: any) => void;
}

export const NotesSection = ({ isEditing, editingClient, handleChange }: NotesSectionProps) => {
  if (!isEditing || !editingClient.notes) {
    return editingClient.notes ? (
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
        <p className="text-sm whitespace-pre-wrap">{editingClient.notes}</p>
      </div>
    ) : null;
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
      <Textarea
        value={editingClient.notes || ''}
        onChange={(e) => handleChange('notes', e.target.value)}
        placeholder="Enter notes"
        className="min-h-[100px]"
      />
    </div>
  );
};
