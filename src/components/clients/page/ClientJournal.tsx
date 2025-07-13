import React, { useState } from "react";
import { X, Plus, Search, Pin, ArrowLeft, FolderOpen, Baby, Heart } from "lucide-react";
import { ClientData, JournalEntry } from "../types/ClientTypes";
import { updateClient } from "../store/clientActions";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import JournalList from "./JournalList";
import JournalEditor from "./JournalEditor";
import { useToast } from "@/hooks/use-toast";
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
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();

  const journalEntries = client.journalEntries || [];
  
  console.log("ClientJournal opened for:", client.name, "Journal entries:", journalEntries);

  const handleCreateEntry = () => {
    const newEntry: JournalEntry = {
      id: uuidv4(),
      title: "New Note",
      content: "",
      timestamp: new Date().toISOString(),
      isPinned: false,
      category: selectedFolder || undefined,
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
    console.log("🔥 === JOURNAL SAVE ENTRY CALLED ===");
    console.log("Entry to save:", entry);
    console.log("Is creating:", isCreating);
    console.log("Current client:", client.name, client.id);
    
    try {
      const updatedEntries = isCreating
        ? [...journalEntries, entry]
        : journalEntries.map(e => e.id === entry.id ? entry : e);

      console.log("Updated entries:", updatedEntries);

      const updatedClient = {
        ...client,
        journalEntries: updatedEntries
      };

      console.log("About to call updateClient with:", updatedClient);
      await updateClient(updatedClient);
      
      console.log("✅ updateClient completed successfully");
      
      toast({
        title: "Note saved",
        description: isCreating ? "New note created successfully" : "Note updated successfully",
      });
      
      setIsCreating(false);
      setView('list');
      
      console.log("✅ View switched to list, save complete");
    } catch (error) {
      console.error("❌ Error saving journal entry:", error);
      
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save note. Please try again.",
        variant: "destructive",
      });
      
      // Still switch back to list view even on error, so user isn't stuck
      console.log("⚠️ Switching to list view despite error");
      setView('list');
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

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? entry.category === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  const folders = [
    { id: 'engagement', label: 'Engagement', icon: Heart, color: 'bg-[#E8D5F3]', activeColor: 'bg-[#D1B3E8]' },
    { id: 'labor-birth', label: 'Labor & Birth', icon: Baby, color: 'bg-[#FFD6CC]', activeColor: 'bg-[#FFBFA8]' },
    { id: 'postpartum', label: 'Postpartum', icon: FolderOpen, color: 'bg-[#D5F3E8]', activeColor: 'bg-[#B8E8D1]' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto h-[90vh] max-h-[90vh] p-0 gap-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        {view === 'list' ? (
          <>
            {/* Notes List View */}
            <DialogHeader className="px-4 py-3 border-b shrink-0">
              <DialogTitle className="text-lg font-semibold">
                Notes
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col h-full">
              {/* Mobile-First Folder Filter Buttons */}
              <div className="px-4 py-3 space-y-3 border-b">
                <Button
                  variant={selectedFolder === null ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full h-12 text-base font-medium ${
                    selectedFolder === null 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background border-2 hover:bg-muted/50'
                  }`}
                >
                  All Notes
                </Button>
                
                <div className="grid grid-cols-1 gap-2">
                  {folders.map((folder) => {
                    const Icon = folder.icon;
                    const isActive = selectedFolder === folder.id;
                    return (
                      <Button
                        key={folder.id}
                        variant="outline"
                        size="lg"
                        onClick={() => setSelectedFolder(folder.id)}
                        className={`w-full h-14 text-base font-medium border-2 transition-all ${
                          isActive 
                            ? `${folder.activeColor} border-primary text-foreground shadow-lg` 
                            : `${folder.color} border-border hover:border-primary/30 text-foreground/90`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{folder.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 border-b shrink-0">
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={handleCreateEntry}
                    size="sm"
                    className="flex-1 h-9"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Note
                    {selectedFolder && (
                      <span className="ml-1 text-xs opacity-75">
                        ({folders.find(f => f.id === selectedFolder)?.label})
                      </span>
                    )}
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
              </div>
            </DialogHeader>

            <div className="flex-1 flex flex-col overflow-hidden pb-4">
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