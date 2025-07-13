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
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className={cn(
        "absolute top-2 left-2 h-6 w-6 p-0 rounded-full",
        "bg-pink-50 border-pink-200 hover:bg-pink-100",
        "text-pink-600 hover:text-pink-700",
        "shadow-sm transition-all duration-200",
        "group z-10",
        className
      )}
      title="Add Triage Note"
    >
      <Stethoscope className="h-3 w-3" />
    </Button>
  );
};