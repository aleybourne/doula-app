import React, { useState, useEffect } from "react";
import { Save, Trash2, X, Pin, PinOff, FolderOpen, Baby, Heart } from "lucide-react";
import { JournalEntry } from "../types/ClientTypes";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import RichTextEditor from "./RichTextEditor";

interface JournalEditorProps {
  entry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ 
  entry, 
  onSave, 
  onDelete, 
  onCancel, 
  isCreating 
}) => {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [isPinned, setIsPinned] = useState(entry.isPinned);
  const [category, setCategory] = useState(entry.category || 'none');
  const [hasChanges, setHasChanges] = useState(false);

  const folders = [
    { id: 'engagement', label: 'Engagement', icon: Heart },
    { id: 'labor-birth', label: 'Labor & Birth', icon: Baby },
    { id: 'postpartum', label: 'Postpartum', icon: FolderOpen }
  ];

  useEffect(() => {
    setTitle(entry.title);
    setContent(entry.content);
    setIsPinned(entry.isPinned);
    setCategory(entry.category || 'none');
    setHasChanges(false);
  }, [entry]);

  useEffect(() => {
    const hasChange = title !== entry.title || 
                     content !== entry.content || 
                     isPinned !== entry.isPinned ||
                     category !== (entry.category || 'none');
    setHasChanges(hasChange);
  }, [title, content, isPinned, category, entry]);

  const handleSave = () => {
    const updatedEntry: JournalEntry = {
      ...entry,
      title: title.trim() || "Untitled Note",
      content,
      isPinned,
      category: category === "none" ? undefined : category,
      timestamp: isCreating ? new Date().toISOString() : entry.timestamp
    };
    onSave(updatedEntry);
    setHasChanges(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(entry.id);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPinned(!isPinned)}
              className="h-8 w-8 p-0"
            >
              {isPinned ? (
                <Pin className="h-4 w-4 text-orange-500" />
              ) : (
                <PinOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {isCreating ? "New note" : formatDate(entry.timestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isCreating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          dir="ltr"
          className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0"
          style={{
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'bidi-override'
          }}
        />

        {/* Category Selector */}
        <div className="mt-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="Select folder..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No folder</SelectItem>
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3" />
                      {folder.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Unsaved changes indicator - positioned right after header */}
      {hasChanges && (
        <div className="px-6 py-3 bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Unsaved changes
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 pb-20 overflow-y-auto">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing your note..."
          className="w-full min-h-96"
        />
      </div>

      {/* Floating Save Now Button */}
      <Button
        onClick={handleSave}
        disabled={!hasChanges && !isCreating}
        className="fixed bottom-6 right-6 h-12 px-6 rounded-full shadow-lg text-white border-0 z-50 font-medium hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#F499B7' }}
        size="lg"
      >
        Save now
      </Button>
    </div>
  );
};

export default JournalEditor;