import React from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Highlighter, 
  Clock, 
  Undo, 
  Redo 
} from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

interface FormattingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  activeFormats: Set<string>;
  canUndo: boolean;
  canRedo: boolean;
  onInsertTimestamp: () => void;
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  onFormat,
  activeFormats,
  canUndo,
  canRedo,
  onInsertTimestamp,
}) => {
  const formatButtons = [
    { command: "bold", icon: Bold, tooltip: "Bold (Ctrl+B)" },
    { command: "italic", icon: Italic, tooltip: "Italic (Ctrl+I)" },
    { command: "underline", icon: Underline, tooltip: "Underline (Ctrl+U)" },
    { command: "insertUnorderedList", icon: List, tooltip: "Bullet List" },
    { command: "insertOrderedList", icon: ListOrdered, tooltip: "Numbered List" },
    { command: "hiliteColor", icon: Highlighter, tooltip: "Highlight", value: "#fbbf24" },
  ];

  const utilityButtons = [
    { 
      command: "timestamp", 
      icon: Clock, 
      tooltip: "Insert Timestamp",
      onClick: onInsertTimestamp 
    },
    { 
      command: "undo", 
      icon: Undo, 
      tooltip: "Undo (Ctrl+Z)",
      onClick: () => onFormat("undo"),
      disabled: !canUndo 
    },
    { 
      command: "redo", 
      icon: Redo, 
      tooltip: "Redo (Ctrl+Y)",
      onClick: () => onFormat("redo"),
      disabled: !canRedo 
    },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg border border-border/50 overflow-x-auto">
      {/* Formatting buttons */}
      <div className="flex items-center gap-1 pr-2 border-r border-border/30">
        {formatButtons.map((button) => {
          const Icon = button.icon;
          const isActive = activeFormats.has(button.command);
          
          return (
            <Button
              key={button.command}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-md transition-all duration-200",
                isActive && "bg-primary/10 text-primary border border-primary/20"
              )}
              onClick={() => onFormat(button.command, button.value)}
              title={button.tooltip}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          );
        })}
      </div>

      {/* Utility buttons */}
      <div className="flex items-center gap-1">
        {utilityButtons.map((button) => {
          const Icon = button.icon;
          
          return (
            <Button
              key={button.command}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-md transition-all duration-200 hover:bg-accent"
              onClick={button.onClick}
              disabled={button.disabled}
              title={button.tooltip}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FormattingToolbar;