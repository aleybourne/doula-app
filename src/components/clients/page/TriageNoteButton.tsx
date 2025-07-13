import React from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="sm"
            variant="outline"
            className={cn(
              "absolute top-2 left-2 h-6 w-6 p-0 rounded-full",
              "bg-background border border-primary/30 hover:border-primary/60",
              "text-primary hover:text-primary/80",
              "shadow-md transition-all duration-200",
              "z-10 hover:scale-105",
              className
            )}
          >
            <Stethoscope className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add Triage Note</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};