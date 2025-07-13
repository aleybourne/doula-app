import React, { useState } from "react";
import { X, Plus, Search, Pin } from "lucide-react";
import { ClientData, JournalEntry } from "../types/ClientTypes";
import { updateClient } from "../store/clientActions";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import JournalList from "./JournalList";
import JournalEditor from "./JournalEditor";
import { v4 as uuidv4 } from 'uuid';

interface ClientJournalProps {
  client: ClientData;
  isOpen: boolean;
  onClose: () => void;
}

const ClientJournal: React.FC<ClientJournalProps> = ({ client, isOpen, onClose }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const journalEntries = client.journalEntries || [];
  
  console.log("ClientJournal opened for:", client.name, "Journal entries:", journalEntries);

  const handleCreateEntry = () => {
    const newEntry: JournalEntry = {
      id: uuidv4(),
      title: "New Note",
      content: "",
      timestamp: new Date().toISOString(),
      isPinned: false,
    };
    setSelectedEntry(newEntry);
    setIsCreating(true);
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    try {
      const updatedEntries = isCreating
        ? [...journalEntries, entry]
        : journalEntries.map(e => e.id === entry.id ? entry : e);

      const updatedClient = {
        ...client,
        journalEntries: updatedEntries
      };

      await updateClient(updatedClient);
      setIsCreating(false);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const updatedEntries = journalEntries.filter(e => e.id !== entryId);
      const updatedClient = {
        ...client,
        journalEntries: updatedEntries
      };

      await updateClient(updatedClient);
      setSelectedEntry(null);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
    }
  };

  const handleTogglePin = async (entryId: string) => {
    try {
      const updatedEntries = journalEntries.map(e => 
        e.id === entryId ? { ...e, isPinned: !e.isPinned } : e
      );
      const updatedClient = {
        ...client,
        journalEntries: updatedEntries
      };

      await updateClient(updatedClient);
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Journal - {client.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[700px]">
          {/* Left Panel - Notes List */}
          <div className="w-80 border-r bg-muted/20 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex gap-2 mb-3">
                <Button
                  onClick={handleCreateEntry}
                  size="sm"
                  className="flex-1 h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Note
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <JournalList
                entries={filteredEntries}
                selectedEntry={selectedEntry}
                onSelectEntry={setSelectedEntry}
                onTogglePin={handleTogglePin}
              />
            </div>
          </div>

          {/* Right Panel - Note Editor/Viewer */}
          <div className="flex-1 flex flex-col">
            {selectedEntry ? (
              <JournalEditor
                entry={selectedEntry}
                onSave={handleSaveEntry}
                onDelete={handleDeleteEntry}
                onCancel={() => {
                  setSelectedEntry(null);
                  setIsCreating(false);
                }}
                isCreating={isCreating}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Pin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No note selected</p>
                  <p className="text-sm">Select a note from the list or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientJournal;