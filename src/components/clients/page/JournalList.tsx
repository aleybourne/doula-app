import React from "react";
import { Pin, PinOff } from "lucide-react";
import { JournalEntry } from "../types/ClientTypes";
import { Button } from "../../ui/button";

interface JournalListProps {
  entries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onTogglePin: (entryId: string) => void;
}

const JournalList: React.FC<JournalListProps> = ({ 
  entries, 
  selectedEntry, 
  onSelectEntry, 
  onTogglePin 
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const groupedEntries = {
    pinned: entries.filter(entry => entry.isPinned),
    today: entries.filter(entry => {
      const today = new Date();
      const entryDate = new Date(entry.timestamp);
      return !entry.isPinned && 
             entryDate.toDateString() === today.toDateString();
    }),
    previous7Days: entries.filter(entry => {
      const now = new Date();
      const entryDate = new Date(entry.timestamp);
      const diffInDays = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return !entry.isPinned && 
             diffInDays > 1 && diffInDays <= 7;
    }),
    older: entries.filter(entry => {
      const now = new Date();
      const entryDate = new Date(entry.timestamp);
      const diffInDays = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return !entry.isPinned && diffInDays > 7;
    })
  };

  const EntryItem: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    const isSelected = selectedEntry?.id === entry.id;
    const preview = entry.content.substring(0, 100);
    
    return (
      <div
        className={`p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${
          isSelected ? 'bg-primary/10 border-primary/20' : ''
        }`}
        onClick={() => onSelectEntry(entry)}
      >
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-medium text-sm truncate flex-1">{entry.title}</h4>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(entry.id);
              }}
              className="h-6 w-6 p-0"
            >
              {entry.isPinned ? (
                <Pin className="h-3 w-3 text-orange-500" />
              ) : (
                <PinOff className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {formatDate(entry.timestamp)}
            </span>
          </div>
        </div>
        {preview && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {preview}
            {entry.content.length > 100 && '...'}
          </p>
        )}
      </div>
    );
  };

  const SectionHeader: React.FC<{ title: string; count: number }> = ({ title, count }) => (
    count > 0 ? (
      <div className="px-3 py-2 bg-muted/40 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title} ({count})
        </h3>
      </div>
    ) : null
  );

  return (
    <div>
      <SectionHeader title="Pinned" count={groupedEntries.pinned.length} />
      {groupedEntries.pinned.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}

      <SectionHeader title="Today" count={groupedEntries.today.length} />
      {groupedEntries.today.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}

      <SectionHeader title="Previous 7 Days" count={groupedEntries.previous7Days.length} />
      {groupedEntries.previous7Days.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}

      <SectionHeader title="Older" count={groupedEntries.older.length} />
      {groupedEntries.older.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}

      {entries.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-sm">No notes yet</p>
          <p className="text-xs mt-1">Create your first note to get started</p>
        </div>
      )}
    </div>
  );
};

export default JournalList;