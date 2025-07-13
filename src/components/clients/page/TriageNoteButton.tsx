import React from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriageNoteButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const TriageNoteButton: React.FC<TriageNoteButtonProps> = ({
  onClick,
  className,
}) => {
  console.log("TriageNoteButton rendering"); // Debug log
  
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className={cn(
        "absolute top-1 left-1 h-6 w-6 p-0 rounded-full",
        "bg-background border-2 border-primary/30 hover:border-primary/60",
        "text-primary hover:text-primary",
        "shadow-lg transition-all duration-200",
        "z-20 hover:scale-110",
        className
      )}
      title="Add Triage Note"
    >
      <Stethoscope className="h-3 w-3" />
    </Button>
  );
};