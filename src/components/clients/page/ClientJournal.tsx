import React, { useState } from "react";
import { X, Plus, Search, Pin, ArrowLeft } from "lucide-react";
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
  const [view, setView] = useState<'list' | 'editor'>('list');

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
    setView('editor');
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsCreating(false);
    setView('editor');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedEntry(null);
    setIsCreating(false);
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
      setView('list');
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
      setView('list');
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
      <DialogContent className="w-full max-w-md mx-auto h-[90vh] max-h-[90vh] p-0 gap-0 sm:max-w-lg md:max-w-2xl">
        {view === 'list' ? (
          <>
            {/* Notes List View */}
            <DialogHeader className="px-4 py-3 border-b shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Notes
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

            <div className="flex flex-col h-full">
              <div className="p-4 border-b shrink-0">
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={handleCreateEntry}
                    size="sm"
                    className="flex-1 h-9"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <JournalList
                  entries={filteredEntries}
                  selectedEntry={selectedEntry}
                  onSelectEntry={handleSelectEntry}
                  onTogglePin={handleTogglePin}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Note Editor View */}
            <DialogHeader className="px-4 py-3 border-b shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <DialogTitle className="text-lg font-semibold">
                    {isCreating ? "New Note" : "Edit Note"}
                  </DialogTitle>
                </div>
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

            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedEntry && (
                <JournalEditor
                  entry={selectedEntry}
                  onSave={handleSaveEntry}
                  onDelete={handleDeleteEntry}
                  onCancel={handleBackToList}
                  isCreating={isCreating}
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientJournal;