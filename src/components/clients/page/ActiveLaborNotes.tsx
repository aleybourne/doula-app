import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Activity, Clock, Heart, Plus, Edit } from "lucide-react";
import { ActiveLaborNotesDialog } from "./ActiveLaborNotesDialog";
import { ClientData, ActiveLaborNote } from "../types/ClientTypes";
import { updateClient } from "../store/clientActions";
import { format } from "date-fns";

interface ActiveLaborNotesProps {
  client: ClientData;
}

const ActiveLaborNotes: React.FC<ActiveLaborNotesProps> = ({ client }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  
  const handleSaveActiveLaborNotes = async (updatedClient: ClientData) => {
    try {
      await updateClient(updatedClient);
    } catch (error) {
      console.error("Failed to save active labor notes:", error);
    }
  };

  const activeLaborNotes = client.activeLaborNotes || [];
  const selectedNote = activeLaborNotes.find(note => note.id === selectedNoteId);
  const hasExistingNotes = activeLaborNotes.length > 0;

  return (
    <div className="px-4 py-3 space-y-3">
      {/* New Labor Notes Button */}
      <ActiveLaborNotesDialog client={client} onSave={handleSaveActiveLaborNotes}>
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
          size="lg"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>New Active Labor Notes</span>
          </div>
        </Button>
      </ActiveLaborNotesDialog>

      {/* Edit Existing Notes Section */}
      {hasExistingNotes && (
        <div className="bg-card/50 border border-border rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Edit className="h-4 w-4" />
            Edit Existing Labor Notes
          </div>
          
          <Select value={selectedNoteId} onValueChange={setSelectedNoteId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select labor note to edit..." />
            </SelectTrigger>
            <SelectContent>
              {activeLaborNotes.map((note) => (
                <SelectItem key={note.id} value={note.id}>
                  {note.admissionTime ? `Admitted ${note.admissionTime}` : 'Labor Note'} - {format(new Date(note.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedNote && (
            <ActiveLaborNotesDialog 
              client={client} 
              onSave={handleSaveActiveLaborNotes}
              existingNote={selectedNote}
            >
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Selected Note
              </Button>
            </ActiveLaborNotesDialog>
          )}
        </div>
      )}
      
      {/* Labor Progress Info */}
      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 text-orange-700 text-sm font-medium mb-2">
          <Clock className="h-4 w-4" />
          Labor in Progress
        </div>
        <p className="text-orange-600 text-sm">
          {hasExistingNotes 
            ? `${activeLaborNotes.length} labor notes documented. Create new notes or edit existing ones to track labor progress.`
            : "Track contractions, monitor progress, and document labor milestones."
          }
        </p>
      </div>
    </div>
  );
};

export default ActiveLaborNotes;